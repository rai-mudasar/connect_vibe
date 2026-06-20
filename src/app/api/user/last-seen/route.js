import userModel from "@/models/userModel";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

// Helper to check DB connection
async function connectDb() {
  if (mongoose.connection.readyState >= 1) return;
  // await yourDbConnectionMethod();
}

export async function POST(req) {
  try {
    await connectDb();

    const rawData = await req.text();
    let userId = null;

    try {
      const parsed = JSON.parse(rawData);
      userId = parsed.userId;
    } catch {
      const params = new URLSearchParams(rawData);
      userId = params.get("userId");
    }

    if (!userId) {
      return new Response("Missing User ID", { status: 400 });
    }

    //OPTIMIZATION: Check current user cache state before writing to disk
    const currentUser = await userModel.findById(userId).select("lastSeen");
    
    if (currentUser?.lastSeen) {
      const timeDifferenceInMs = new Date() - new Date(currentUser.lastSeen);
      const oneMinuteInMs = 60 * 1000;

      // Agar pichle 60 seconds me pehle hi call ho chuka hai, to extra database transaction skip karein!
      if (timeDifferenceInMs < oneMinuteInMs) {
        return new Response("Skipped: Already up to date", { status: 200 });
      }
    }

    // Atomic pinpoint operation only when threshold breaks
    await userModel.findByIdAndUpdate(userId, {
      lastSeen: new Date(),
    });

    revalidatePath('/admin/users')

    return new Response("Success", { status: 200 });
  } catch (error) {
    console.error("Error in last-seen beacon API:", error);
    return new Response("Internal Error", { status: 500 });
  }
}
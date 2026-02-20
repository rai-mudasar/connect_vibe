'use server'

import connectToDb from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

async function getAuthSession() {
  await connectToDb();
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}

// 1. Get All Friends
export async function getFriends() {
  try {
    const session = await getAuthSession();

    const user = await userModel
      .findById(session.user.id)
      .populate(
        "friends",
        "firstName lastName username profileImageUrl occupation",
      )
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(user.friends || [])),
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }
}

export async function getNearbyPeople() {
  try {
    const session = await getAuthSession();
    const userId = session.user.id;

    // Fetch the current user to see who they are already connected with
    const currentUser = await userModel.findById(userId);

    // Find users who:
    // 1. Are NOT the current user
    // 2. Are NOT already friends
    // 3. Haven't sent/received a request to/from the current user
    const excludeIds = [
      userId,
      ...currentUser.friends,
      ...currentUser.friendRequestsSent,
      ...currentUser.friendRequestsReceived,
    ];

    const users = await userModel
      .find({
        _id: { $nin: excludeIds },
        isBanned: false,
      })
      .select("firstName lastName username profileImageUrl occupation")
      .limit(20)
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(users)),
    };
  } catch (error) {
    return { success: false, message: error.message, data: [] };
  }
}

// 2. Get Pending Requests (People who sent YOU a request)
export async function getPendingRequests() {
  try {
    const session = await getAuthSession();

    const user = await userModel
      .findById(session.user.id)
      .populate(
        "friendRequestsReceived",
        "firstName lastName username profileImageUrl occupation",
      )
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(user.friendRequestsReceived || [])),
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }
}

// 3. Get Sent Requests (People YOU asked to be friends)
export async function getSentRequests() {
  try {
    const session = await getAuthSession();

    const user = await userModel
      .findById(session.user.id)
      .populate(
        "friendRequestsSent",
        "firstName lastName username profileImageUrl occupation",
      )
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(user.friendRequestsSent || [])),
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }
}

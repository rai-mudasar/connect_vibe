import { getSessionUser } from "@/actions/userActions";
import { pusherServer } from "@/lib/pusher";

export async function POST(req) {
  try {
    const sessionUser = await getSessionUser(); 

    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);
    
    const socketId = params.get("socket_id");
    const channelName = params.get("channel_name");

    if (!socketId || !channelName) {
      return new Response("Missing socket_id or channel_name", { status: 400 });
    }

    const presenceData = {
      user_id: sessionUser.id,
      user_info: {
        firstName: sessionUser.firstName || "User",
        lastName: sessionUser.lastName || "",
      },
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channelName, presenceData);

    return new Response(JSON.stringify(authResponse), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Pusher Auth Route Error:", error);
    
    // Agar getSessionUser ka auth error ho to status 401 bhejenge, warna internal server error 500
    const isAuthError = error.message?.includes("Unauthorized");
    return new Response(error.message || "Internal Server Error", { 
      status: isAuthError ? 401 : 500 
    });
  }
}
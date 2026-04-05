"use server";

import connectToDb from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

async function getAuthSession() {
  await connectToDb();
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}

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

export async function handleUnfriend(targetUserId) {
  const session = await getAuthSession();

  try {
    const [targetUser, loggedInUser] = await Promise.all([
      userModel.findById(targetUserId),
      userModel.findById(session.user.id),
    ]);

    if (!targetUser)
      return {
        success: false,
        message: "Target user not found",
      };
    if (!loggedInUser)
      return {
        success: false,
        message: "Session user not found",
      };

    if (!loggedInUser.friends.includes(targetUserId)) {
      return {
        success: false,
        message: "This user is not in your friend list",
      };
    }

    loggedInUser.friends.pull(targetUserId);
    targetUser.friends.pull(loggedInUser._id);

    await Promise.all([loggedInUser.save(), targetUser.save()]);

    return {
      success: true,
      message: "Unfriended successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: `An error occurred while unfriending : ${error.message || error}`,
    };
  }
}

export async function handleSentFriendRequest(targetUserId) {
  const session = await getAuthSession();

  try {
    const [targetUser, loggedInUser] = await Promise.all([
      userModel.findById(targetUserId),
      userModel.findById(session.user.id),
    ]);

    if (!targetUser)
      return {
        success: false,
        message: "Target user not found",
      };
    if (!loggedInUser)
      return {
        success: false,
        message: "LoggedIn user not found",
      };

    loggedInUser.friendRequestsSent.addToSet(targetUserId);
    targetUser.friendRequestsReceived.addToSet(loggedInUser._id);

    await Promise.all([loggedInUser.save(), targetUser.save()]);

    revalidatePath(`/friends`);
    revalidatePath(`/profile/${loggedInUser.username}`);
    return {
      success: true,
      message: "Sent friend request successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: `An error occurred while sending friend Request : ${error.message || error}`,
    };
  }
}

export async function handleApproveFriendRequest(targetUserId) {
  const session = await getAuthSession();

  try {
    const [targetUser, loggedInUser] = await Promise.all([
      userModel.findById(targetUserId),
      userModel.findById(session.user.id),
    ]);

    if (!targetUser)
      return {
        success: false,
        message: "Target user not found",
      };
    if (!loggedInUser)
      return {
        success: false,
        message: "Session user not found",
      };

    loggedInUser.friends.addToSet(targetUserId);
    loggedInUser.friendRequestsReceived.pull(targetUserId)

    targetUser.friends.addToSet(loggedInUser._id);
    targetUser.friendRequestsSent.pull(loggedInUser._id)

    await Promise.all([loggedInUser.save(), targetUser.save()]);

    return {
      success: true,
      message: "Approve friend request successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: `An error occurred while approving friend Request : ${error.message || error}`,
    };
  }
}

export async function handleRejectFriendRequest(targetUserId) {
  const session = await getAuthSession();

  try {
    const [targetUser, loggedInUser] = await Promise.all([
      userModel.findById(targetUserId),
      userModel.findById(session.user.id),
    ]);

    if (!targetUser) {
      return {
        success: false,
        message: "Target user not found",
      };
    }

    if (!loggedInUser) {
      return {
        success: false,
        message: "LoggedIn user not found",
      };
    }

    loggedInUser.friendRequestsSent.pull(targetUserId);
    targetUser.friendRequestsReceived.pull(loggedInUser._id);

    await Promise.all([loggedInUser.save(), targetUser.save()]);

    return {
      success: true,
      message: "Cancelled sent friend request successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: `An error occurred while cancelling send friend Request : ${error.message || error}`,
    };
  }
}

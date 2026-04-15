"use server";

import userModel from "@/models/userModel";
import { connection } from "next/server";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "./userActions";


export async function getFriends() {
  try {
    const [_, user] = await Promise.all([
      getSessionUser(),
      userModel
      .findById(session.user.id)
      .populate(
        "friends",
        "firstName lastName username profileImageUrl occupation",
      )
      .lean(),
    ])

    return {
      success: true,
      data: JSON.parse(JSON.stringify(user.friends || [])),
    };
  } catch (error) {
    console.error(`Error in getFriends action : ${error.message || error}`)
    return {
      success: false,
      message: `Error in getFriends action : ${error.message || error}`,
      data: [],
    };
  }
}

export async function getNearbyPeople() {
  await connection();
  try {
    const sessionUser = await getSessionUser();
    const loggedInUserId = sessionUser.id;

    const currentUser = await userModel.findById(loggedInUserId).select('friends friendRequestsSent friendRequestsReceived');

    const excludeIds = [
      loggedInUserId,
      ...currentUser.friends,
      ...currentUser.friendRequestsSent,
      ...currentUser.friendRequestsReceived,
    ];

    const users = await userModel
      .find({
        _id: { $nin: excludeIds },
        isBanned: false,
      })
      .select("username firstName lastName profileImageUrl")
      .limit(10)
      .lean();

    return {
      success: true,
      message: "Fetch Successfully!",
      data: JSON.parse(JSON.stringify(users)),
    };
  } catch (error) {
    console.error(`Error in getNearbyPeople action : ${error.message || error}`);
    return { 
      success: false, 
      message: `Error in getNearbyPeople action : ${error.message || error}`, 
      data: [] 
    };
  }
}

export async function getPendingRequests() {
  try {
    const sessionUser = await getSessionUser();

    const user = await userModel
      .findById(sessionUser.id)
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
    const sessionUser = await getSessionUser();

    const user = await userModel
      .findById(sessionUser.id)
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
    console.error(`Error in getSentRequests action : ${error.message || error}`)
    return {
      success: false,
      message: `Error in getSentRequests action : ${error.message || error}`,
      data: [],
    };
  }
}

export async function handleUnfriend(targetUserId) {
  const sessionUser = await getSessionUser();

  try {
    const [targetUser, loggedInUser] = await Promise.all([
      userModel.findById(targetUserId),
      userModel.findById(sessionUser.id),
    ]);

    if (!targetUser) throw new Error("Target user not found")
    if (!loggedInUser) throw new Error("LoggedIn user not found")

    if (!loggedInUser.friends.includes(targetUserId)) throw new Error("This user is not in your friend list")

    loggedInUser.friends.pull(targetUserId);
    targetUser.friends.pull(loggedInUser._id);

    await Promise.all([loggedInUser.save(), targetUser.save()]);

    return {
      success: true,
      message: "Unfriended successfully",
    };
  } catch (error) {
    console.error(`Error in handleUnfriend action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in handleUnfriend action : ${error.message || error}`,
    };
  }
}

export async function handleSentFriendRequest(targetUserId) {
  const sessionUser = await getSessionUser();

  try {
    const [targetUser, loggedInUser] = await Promise.all([
      userModel.findById(targetUserId),
      userModel.findById(sessionUser.id),
    ]);

    if (!targetUser) throw new Error("Target user not found")
    if (!loggedInUser) throw new Error("LoggedIn user not found")

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
  const sessionUser = await getSessionUser();

  try {
    const [targetUser, loggedInUser] = await Promise.all([
      userModel.findById(targetUserId),
      userModel.findById(sessionUser.id),
    ]);

    if (!targetUser) throw new Error("Target user not found")
    if (!loggedInUser) throw new Error("LoggedIn user not found")

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
    console.error(`Error in handleApproveFriendRequest action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in handleApproveFriendRequest action : ${error.message || error}`,
    };
  }
}

export async function handleRejectFriendRequest(targetUserId) {
  const sessionUser = await getSessionUser();

  try {
    const [targetUser, loggedInUser] = await Promise.all([
      userModel.findById(targetUserId),
      userModel.findById(sessionUser.id),
    ]);

    if (!targetUser) throw new Error("Target user not found")
    if (!loggedInUser) throw new Error("LoggedIn user not found")

    loggedInUser.friendRequestsSent.pull(targetUserId);
    targetUser.friendRequestsReceived.pull(loggedInUser._id);

    await Promise.all([loggedInUser.save(), targetUser.save()]);

    revalidatePath(`/friends`)
    revalidatePath(`/profile/${loggedInUser?.username}`)

    return {
      success: true,
      message: "Cancelled sent friend request successfully",
    };
  } catch (error) {
    console.error(`Error in handleRejectFriendRequest action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in handleRejectFriendRequest action : ${error.message || error}`,
    };
  }
}

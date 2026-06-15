"use server";

import { connection } from "next/server";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "./userActions";
import userModel from "@/models/userModel";
import friendRequestModel from "@/models/friendRequestModel";

export async function getFriends() {
  try {
    const sessionUser = await getSessionUser();
    const user = await userModel
      .findById(sessionUser.id)
      .populate("friends", "firstName lastName username profileImageUrl occupation")
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(user?.friends || [])),
    };
  } catch (error) {
    // console.error(`Error in getFriends action : ${error.message || error}`);
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

    const currentUser = await userModel.findById(loggedInUserId).select('friends').lean();
    
    const activeRequests = await friendRequestModel.find({
      $or: [{ sender: loggedInUserId }, { receiver: loggedInUserId }],
      status: 'pending'
    }).select('sender receiver').lean();

    const requestUserIds = activeRequests.map(req => 
      req.sender.toString() === loggedInUserId ? req.receiver : req.sender
    );

    const excludeIds = [
      loggedInUserId,
      ...(currentUser?.friends || []),
      ...requestUserIds
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
    // console.error(`Error in getNearbyPeople action : ${error.message || error}`);
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

    const incomingRequests = await friendRequestModel
      .find({ receiver: sessionUser.id, status: 'pending' })
      .populate("sender", "firstName lastName username profileImageUrl occupation")
      .lean();

    const formattedData = incomingRequests.map(req => req.sender);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(formattedData)),
    };
  } catch (error) {
    return {
      success: false,
      message: `Error in getPendingRequests action : ${error.message || error}`,
      data: [],
    };
  }
}

export async function getSentRequests() {
  console.log("enetred-------------------------------------------------")
  try {
    console.log('f');
    const sessionUser = await getSessionUser();
    
    const outgoingRequests = await friendRequestModel
    .find({ sender: sessionUser.id, status: 'pending' })
    .populate("receiver", "firstName lastName username profileImageUrl occupation")
    .lean();
    
    console.log("enetred3-------------------------------------------------")
    const formattedData = outgoingRequests.map(req => req.receiver);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(formattedData)),
    };
  } catch (error) {
    console.error(`Error in getSentRequests action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in getSentRequests action : ${error.message || error}`,
      data: [],
    };
  }
}

export async function handleUnfriend(targetUserId) {
  try {
    const sessionUser = await getSessionUser();
    const [targetUser, loggedInUser] = await Promise.all([
      userModel.findById(targetUserId),
      userModel.findById(sessionUser.id),
    ]);

    if (!targetUser) throw new Error("Target user not found");
    if (!loggedInUser) throw new Error("LoggedIn user not found");

    if (!loggedInUser.friends.includes(targetUserId)) throw new Error("This user is not in your friend list");

    loggedInUser.friends.pull(targetUserId);
    targetUser.friends.pull(loggedInUser._id);

    await Promise.all([
      loggedInUser.save(),
      targetUser.save(),
      friendRequestModel.deleteMany({
        $or: [
          { sender: loggedInUser._id, receiver: targetUserId },
          { sender: targetUserId, receiver: loggedInUser._id }
        ]
      })
    ]);

    revalidatePath(`/friends`);
    return {
      success: true,
      message: "Unfriended successfully",
    };
  } catch (error) {
    // console.error(`Error in handleUnfriend action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in handleUnfriend action : ${error.message || error}`,
    };
  }
}

export async function handleSentFriendRequest(targetUserId) {
  try {
    const sessionUser = await getSessionUser();
    if (sessionUser.id === targetUserId) throw new Error("You cannot send a friend request to yourself");

    const existingRequest = await friendRequestModel.findOne({
      $or: [
        { sender: sessionUser.id, receiver: targetUserId },
        { sender: targetUserId, receiver: sessionUser.id }
      ],
      status: 'pending'
    });

    if (existingRequest) throw new Error("An active friend request already exists between you two");

    await friendRequestModel.create({
      sender: sessionUser.id,
      receiver: targetUserId,
      status: 'pending'
    });


    revalidatePath(`/friends`);
    if (sessionUser) revalidatePath(`/profile/${sessionUser.username}`);
    
    return {
      success: true,
      message: "Sent friend request successfully",
    };
  } catch (error) {
    // console.error(error);
    return {
      success: false,
      message: `An error occurred in handleSentFriendRequest avtion: ${error.message || error}`,
    };
  }
}

export async function handleApproveFriendRequest(targetUserId) {
  const sessionUser = await getSessionUser();

  try {
    const requestDoc = await friendRequestModel.findOne({
      sender: targetUserId,
      receiver: sessionUser.id,
      status: 'pending'
    });

    if (!requestDoc) throw new Error("No pending friend request found to approve");

    const [targetUser, loggedInUser] = await Promise.all([
      userModel.findById(targetUserId),
      userModel.findById(sessionUser.id),
    ]);

    if (!targetUser || !loggedInUser) throw new Error("User validation mismatch during confirmation");

    loggedInUser.friends.addToSet(targetUserId);
    targetUser.friends.addToSet(loggedInUser._id);
    
    requestDoc.status = 'accepted';

    await Promise.all([
      loggedInUser.save(),
      targetUser.save(),
      requestDoc.save()
    ]);

    revalidatePath(`/friends`);
    return {
      success: true,
      message: "Approve friend request successfully",
    };
  } catch (error) {
    // console.error(`Error in handleApproveFriendRequest action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in handleApproveFriendRequest action : ${error.message || error}`,
    };
  }
}

export async function handleRejectFriendRequest(targetUserId) {
  const sessionUser = await getSessionUser();

  try {
    const result = await friendRequestModel.deleteOne({
      $or: [
        { sender: targetUserId, receiver: sessionUser.id, status: 'pending' },
        { sender: sessionUser.id, receiver: targetUserId, status: 'pending' }
      ]
    });

    if (result.deletedCount === 0) throw new Error("No active pending request found to dismiss");


    revalidatePath(`/friends`);
    if (sessionUser) revalidatePath(`/profile/${sessionUser.username}`);

    return {
      success: true,
      message: "Friend request cancelled/declined successfully",
    };
  } catch (error) {
    // console.error(`Error in handleRejectFriendRequest action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in handleRejectFriendRequest action : ${error.message || error}`,
    };
  }
}
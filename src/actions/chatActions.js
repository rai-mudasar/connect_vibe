"use server";

import { connection } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { getSessionUser } from "./userActions";
import connectToDb from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import messageModel from "@/models/messageModel";
import conversationModel from "@/models/conversationModel";

export async function getFriends() {
  await connection();

  try {
    const sessionUser = await getSessionUser()
    const user = await userModel
      .findById(sessionUser.id)
      .populate("friends", "firstName lastName profileImageUrl")
      .lean();

    if (!user) throw new Error("User not found!");

    return {
      success: true,
      message: 'Fetched Successfully',
      data: { 'loggedInUserId': sessionUser.id, 'friends': JSON.parse(JSON.stringify(user.friends)) }
    };
  } catch (error) {
    console.error(`Error in getFriends action : ${error.message || error}`)
    return {
      success: false,
      message: `Error in getFriends action : ${error.message || error}`,
    }
  }
}

export async function getLoggedInUserAllConversations() {
  await connection();
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.id) {
      return { success: false, message: "Unauthorized" };
    }

    // 1. Fetch conversations exactly as you did before
    const loggedInUserTotalConversations = await conversationModel
      .find({ participants: { $in: [sessionUser.id] } })
      .populate("participants", "firstName lastName profileImageUrl bio")
      .populate("lastMessage", "text createdAt")
      .sort({ updatedAt: -1 });

    // 2. Extract all conversation IDs to query unread messages in one go
    const conversationIds = loggedInUserTotalConversations.map((chat) => chat._id);

    // 3. Count unread messages sent by the OTHER users across all these conversations
    const unreadCountsGrouped = await messageModel.aggregate([
      {
        $match: {
          conversationId: { $in: conversationIds },
          senderId: { $ne: sessionUser.id }, // 👈 Only count messages the logged-in user RECEIVED
          isRead: false,
        },
      },
      {
        $group: {
          _id: "$conversationId",
          count: { $sum: 1 },
        },
      },
    ]);

    const unreadCountMap = unreadCountsGrouped.reduce((acc, current) => {
      acc[current._id.toString()] = current.count;
      return acc;
    }, {});

    // 5. Convert Mongoose documents to plain objects and inject the calculated unread counts
    const conversationsWithUnread = loggedInUserTotalConversations.map((chat) => {
      const plainChat = chat.toObject(); // Convert to plain object to allow direct manipulation
      
      return {
        ...plainChat,
        _id: plainChat._id.toString(), // Ensure IDs are strings for React keys
        unreadCount: unreadCountMap[plainChat._id.toString()] || 0, // 👈 Fallback to 0 if no unread messages
      };
    });

    return JSON.parse(JSON.stringify(conversationsWithUnread));

  } catch (error) {
    console.error(`Error in getLoggedInUserAllConversations action: ${error.message || error}`);
    return {
      success: false,
      message: `Error in getLoggedInUserAllConversations action: ${error.message || error}`,
    };
  }
}

export async function getConversationsById(chatId) {
  try {
    const [_, conversation] = await Promise.all([
      getSessionUser(),
      conversationModel
        .findById(chatId)
        .populate("participants", "firstName lastName profileImageUrl bio")
        .populate("lastMessage", "text createdAt")
        .sort({ updatedAt: -1 }),
    ])

    return JSON.parse(JSON.stringify(conversation))

  } catch (error) {
    console.error(`Error in getConversationsById action : ${error.message || error}`)
    return {
      success: false,
      message: `Error in getConversationsById action : ${error.message || error}`,
    }
  }
}

export async function getOrCreateConversation(currentUserId, targetUserId) {
  await connectToDb();

  let chat = await conversationModel
    .findOne({
      participants: { $all: [currentUserId, targetUserId] },
    })
    .populate("participants", "firstName lastName profileImageUrl")
    .populate("lastMessage", "text createdAt");

  if (!chat) {
    const newChat = await conversationModel.create({
      participants: [currentUserId, targetUserId],
      isGroup: false,
    });

    chat = await conversationModel
      .findById(newChat._id)
      .populate("participants", "firstName lastName profileImageUrl");
  }

  return JSON.parse(JSON.stringify(chat));
}

export async function getInitialChatData(conversationId) {
  if (!conversationId) return;
  try {
    const [sessionUser, messages] = await Promise.all([
      getSessionUser(),
      messageModel.find({ conversationId: conversationId }).sort({ createdAt: 1 }),
    ])

    return {
      success: true,
      message: "Successfully executed",
      data: JSON.parse(JSON.stringify({ "currentLoggedInUserId": sessionUser.id, "messages": messages }))
    };

  } catch (error) {
    console.error(`Error in getting initial chat data action : ${error.message || error}`)
    return {
      success: false,
      message: `Error in getting initial chat data action : ${error.message || error}`,
    }
  }
}

export async function sendMessage(conversationId, senderId, text) {
  try {
    await getSessionUser();

    const newMessage = await messageModel.create({
      conversationId,
      senderId,
      text,
    });

    await conversationModel.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: newMessage._id,
        updatedAt: new Date(),
      },
      { new: true }
    );

    const unreadCount = await messageModel.countDocuments({
      conversationId: conversationId,
      isRead: false,
    });

    await pusherServer.trigger(conversationId, "newMessage", {
      conversationId: conversationId,
      newMessage: newMessage,
      lastMessage: newMessage,
      unreadCount: unreadCount,
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newMessage))
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: error.message };
  }
}

export async function markMessagesAsRead(conversationId, userId) {
  try {
    await connectToDb();

    // Mark all messages sent by the OTHER user in this conversation as read
    await messageModel.updateMany(
      { conversationId, senderId: { $ne: userId }, isRead: false },
      { $set: { isRead: true } }
    );

    // Notify the conversation channel that unread counts have dropped to 0
    await pusherServer.trigger(conversationId, "messagesRead", {
      conversationId,
      unreadCount: 0,
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { success: false, error: error.message };
  }
}
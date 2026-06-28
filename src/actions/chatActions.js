"use server";

import { connection } from "next/server";
import { revalidatePath } from "next/cache";
import { pusherServer } from "@/lib/pusher";
import { getSessionUser } from "./userActions";
import mongoose from "mongoose";
import userModel from "@/models/userModel";
import messageModel from "@/models/messageModel";
import conversationModel from "@/models/conversationModel";

export async function getLoggedInUserWithFriends() {
  await connection();

  try {
    const sessionUser = await getSessionUser();
    const userWithFriends = await userModel
      .findById(sessionUser.id)
      .select('username firstName lastName profileImageUrl friends')
      .populate("friends", "firstName lastName profileImageUrl")
      .lean();

    if (!userWithFriends) throw new Error("User not found!");

    const { friends, ...user } = userWithFriends;

    return {
      success: true,
      message: 'Fetched Successfully',
      data: { 'loggedInUser': JSON.parse(JSON.stringify(user)), 'friends': JSON.parse(JSON.stringify(friends)) }
    };
  } catch (error) {
    console.error(`Error in getLoggedInUserWithFriends action : ${error.message || error}`)
    return {
      success: false,
      message: `Error in getLoggedInUserWithFriends action : ${error.message || error}`,
    }
  }
}

export async function getLoggedInUserAllConversations() {
  await connection();
  try {
    const sessionUser = await getSessionUser();

    const loggedInUserTotalConversations = await conversationModel
      .find({ participants: { $in: [sessionUser.id] }, deletedFor: { $ne: sessionUser.id } })
      .populate("participants", "firstName lastName profileImageUrl bio")
      .populate("lastMessage", "text deletedFor createdAt")
      .sort({ updatedAt: -1 });

    const conversationIds = loggedInUserTotalConversations.map((chat) => chat._id);

    // Count unread messages sent by the OTHER users across all these conversations
    const unreadCountsGrouped = await messageModel.aggregate([
      {
        $match: {
          conversationId: { $in: conversationIds },
          senderId: { $ne: new mongoose.Types.ObjectId(sessionUser.id) },
          isRead: false,
          deletedFor: { $ne: new mongoose.Types.ObjectId(sessionUser.id) }
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

    const conversationsWithUnread = loggedInUserTotalConversations.map((chat) => {
      const plainChat = chat.toObject();

      return {
        ...plainChat,
        _id: plainChat._id.toString(),
        unreadCount: unreadCountMap[plainChat._id.toString()] || 0,
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

// Only for specific chat header
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
    // console.error(`Error in getConversationsById action : ${error.message || error}`)
    return {
      success: false,
      message: `Error in getConversationsById action : ${error.message || error}`,
    }
  }
}

export async function getOrCreateConversation(currentUserId, targetUserId) {
  try {
    const sessionUser = await getSessionUser();

    let chat = await conversationModel
      .findOne({
        participants: { $all: [currentUserId, targetUserId] },
      })
      .populate("participants", "firstName lastName profileImageUrl")
      .populate("lastMessage", "text createdAt");

    if (chat) {
      if (chat.deletedFor && chat.deletedFor.includes(sessionUser.id)) {
        chat = await conversationModel.findByIdAndUpdate(
          chat._id,
          { $pull: { deletedFor: sessionUser.id } },
          { new: true }
        )
          .populate("participants", "firstName lastName profileImageUrl")
          .populate("lastMessage", "text createdAt");
      }
    } else {
      const newChat = await conversationModel.create({
        participants: [currentUserId, targetUserId],
        deletedFor: [],
      });

      chat = await conversationModel
        .findById(newChat._id)
        .populate("participants", "firstName lastName profileImageUrl");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(chat))
    };
  } catch (error) {
    // console.log(`Error in getOrCreateConversation action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in getOrCreateConversation action : ${error.message || error}`
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

    const conversation = await conversationModel.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: newMessage._id,
        updatedAt: new Date(),
      },
      { new: true }
    )
      .populate("participants", "firstName lastName profileImageUrl bio");

    const unreadCount = await messageModel.countDocuments({
      conversationId: conversationId,
      isRead: false,
    });

    await pusherServer.trigger(conversationId, "newMessage", {
      newMessage: newMessage,
    });

    const recipient = conversation.participants.find(p => p._id.toString() !== senderId);
    if (recipient) {
      await pusherServer.trigger(`user-${recipient._id}`, "unreadCounter", {
        conversationId,
        unreadCount: unreadCount,
        lastMessage: newMessage,
        participants: JSON.parse(JSON.stringify(conversation.participants)),
      });
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newMessage))
    };
  } catch (error) {
    console.error(`Error in sendMessage action: ${error?.message || error}`);
    return {
      success: false,
      message: `Error in sendMessage action: ${error?.message || error}`
    };
  }
}

export async function markMessagesAsRead(conversationId, userId) {
  try {
    await getSessionUser();

    // 1. Existing logic: Mark messages of this specific room as read
    await messageModel.updateMany(
      { conversationId, senderId: { $ne: userId }, isRead: false },
      { $set: { isRead: true } }
    );

    // 2. Existing logic: Trigger pusher for the current chat room
    await pusherServer.trigger(conversationId, "messagesRead", {
      conversationId,
      unreadCount: 0,
    });

    const remainingGlobalCount = await getGlobalUnreadMessageCount();

    // 4. NEW CRITICAL ADDITION: Broadcast the new total count to the navbar badge channel
    await pusherServer.trigger(`user-${userId}`, "globalCountUpdate", {
      totalUnread: remainingGlobalCount
    });

    return { success: true };
  } catch (error) {
    console.error(`Error in markMessagesAsRead action: ${error?.message || error}`);
    return { 
      success: false, 
      message: `Error in markMessagesAsRead action: ${error?.message || error}`
    };
  }
}

export async function fetchMoreMessages(conversationId, cursorId) {
  if (!conversationId || !cursorId) return { success: false, message: "Missing required parameters" };

  try {
    const sessionUser = await getSessionUser();

    // Query documents older than our cursor ID
    const messages = await messageModel.find({
      conversationId: conversationId,
      deletedFor: { $ne: sessionUser.id },
      _id: { $lt: new mongoose.Types.ObjectId(cursorId) }
    })
      .sort({ createdAt: -1 })
      .limit(21)
      .lean();

    const hasMore = messages.length > 20;
    if (hasMore) messages.pop();

    return {
      success: true,
      data: JSON.parse(JSON.stringify({
        messages: messages,
        hasMore: hasMore
      }))
    };
  } catch (error) {
    console.error(`Error in fetchMoreMessages action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in fetchMoreMessages action : ${error.message || error}`
    };
  }
}

export async function deleteChatForUser(conversationId) {
  try {
    const sessionUser = await getSessionUser();

    const [conversation, messages] = await Promise.all([
      conversationModel.findByIdAndUpdate(
        conversationId,
        { $addToSet: { deletedFor: sessionUser.id } },
        { new: true }
      ),

      messageModel.updateMany(
        { conversationId: conversationId },
        { $addToSet: { deletedFor: sessionUser.id } },
        { new: true }
      )
    ]);

    if (!conversation) return {
      success: false,
      message: "Conversation not found"
    };

    const totalParticipants = conversation.participants.length;
    const totalDeletions = conversation.deletedFor.length;

    if (totalDeletions >= totalParticipants) {
      await Promise.all([
        conversationModel.findByIdAndDelete(conversationId),
        messageModel.deleteMany({ conversationId: conversationId })
      ]);

      revalidatePath(`/chat`)

      return {
        success: true,
        message: "Conversation hard deleted from database successfully."
      };
    }

    return {
      success: true,
      message: "Conversation deleted for current user safely."
    };
  } catch (error) {
    console.error(`Error in deleteChatForUser action: ${error.message || error}`);
    return {
      success: false,
      message: `Error in deleteChatForUser action: ${error.message || error}`
    };
  }
}

export async function restoreChatForUser(conversationId) {
  try {
    const sessionUser = await getSessionUser();

    const conversation = await conversationModel.findByIdAndUpdate(
      conversationId,
      { $pull: { deletedFor: sessionUser.id } },
      { new: true }
    );

    if (!conversation) return { success: false, message: "Conversation not found" };

    return {
      success: true,
      message: "Conversation unarchived successfully. New historical values synchronized.",
      data: JSON.parse(JSON.stringify(conversation))
    };
  } catch (error) {
    console.error("Error processing archive retrieval restore loop:", error);
    return { success: false, error: error.message };
  }
}

export async function getInitialChatData(conversationId) {

  if (!conversationId) return { success: false, message: "Missing conversation ID" };

  try {
    const sessionUser = await getSessionUser()
    const [messages, conversationMetadata] = await Promise.all([
      messageModel.find({ conversationId: conversationId, deletedFor: { $ne: sessionUser.id } }).sort({ createdAt: -1 }).limit(21).lean(),
      conversationModel.findById(conversationId).populate("participants", "firstName lastName profileImageUrl bio").lean()
    ]);

    const hasMore = messages.length > 20;
    if (hasMore) messages.pop();

    return {
      success: true,
      message: "Successfully executed single load pipeline",
      data: JSON.parse(JSON.stringify({
        currentLoggedInUserId: sessionUser.id,
        messages: messages,
        hasMore: hasMore,
        conversationMetadata: conversationMetadata
      }))
    };

  } catch (error) {
    // console.error(`Error in getInitialChatData action : ${error.message || error}`)
    return {
      success: false,
      message: `Error in getInitialChatData action : ${error.message || error}`,
    };
  }
}

export async function getMessagesByFriendId(friendId) {
  if (!friendId) {
    return {
      success: false,
      message: "No friendId received!"
    }
  }

  try {
    const sessionUser = await getSessionUser();
    const conversation = await conversationModel.findOne({
      $and: [
        { participants: sessionUser.id },
        { participants: friendId }
      ]
    })
      .lean();

    const messages = await messageModel.find({
      conversationId: conversation._id,
      deletedFor: { $ne: sessionUser.id }
    })
      .sort({ createdAt: -1 })
      .limit(21)
      .lean();

    return {
      success: true,
      data: { messages: JSON.parse(JSON.stringify(messages)), conversationId: JSON.parse(JSON.stringify(conversation?._id)) }
    }
  } catch (error) {
    console.error(`Error in getMessagesByFriendId action : ${error.message || error}`)
    return {
      success: false,
      message: `Error in getMessagesByFriendId action : ${error.message || error}`,
    };
  }
}

export async function getGlobalUnreadMessageCount() {
  await connection();
  try {
    const sessionUser = await getSessionUser();

    const activeChats = await conversationModel.find({
      participants: { $in: [sessionUser.id] },
      deletedFor: { $ne: sessionUser.id }
    }).select("_id");

    const activeChatIds = activeChats.map(chat => chat._id);

    const result = await messageModel.aggregate([
      {
        $match: {
          conversationId: { $in: activeChatIds },
          senderId: { $ne: new mongoose.Types.ObjectId(sessionUser.id) },
          isRead: false,
          deletedFor: { $ne: new mongoose.Types.ObjectId(sessionUser.id) }
        }
      },
      {
        $group: {
          _id: null,
          totalUnread: { $sum: 1 }
        }
      }
    ]);

    return {
      success: true,
      data: result[0]?.totalUnread || 0
    };
  } catch (error) {
    console.error("Error fetching global unread count:", error);
    return 0;
  }
}


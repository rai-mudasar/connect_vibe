"use server";

import connectToDb from "@/lib/dbConnect";
import { pusherServer } from "@/lib/pusher";
import userModel from "@/models/userModel";
import messageModel from "@/models/messageModel";
import conversationModel from "@/models/conversationModel";

export async function getFriends(loggedInUserId) {
  connectToDb();
  const user = await userModel
    .findById(loggedInUserId)
    .populate("friends", "firstName lastName profileImageUrl");

  if (!user) return [];

  return JSON.parse(JSON.stringify(user.friends));
}

export async function getLoggedInUserAllConversations(loggedInUserId) {
  await connectToDb();

  const loggedInUserTotalConversations = await conversationModel
    .find({
      participants: { $in: [loggedInUserId] },
    })
    .populate("participants", "firstName lastName profileImageUrl")
    .populate("lastMessage", "text createdAt")
    .sort({ updatedAt: -1 });

  return JSON.parse(JSON.stringify(loggedInUserTotalConversations));
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

export async function getMessages(conversationId) {
  if (!conversationId) return [];
  await connectToDb();

  const messages = await messageModel
    .find({ conversationId })
    .sort({ createdAt: 1 });

  return JSON.parse(JSON.stringify(messages));
}

export async function sendMessage(conversationId, senderId, text) {

  await connectToDb();

  const newMessage = await messageModel.create({
    conversationId,
    senderId,
    text,
  });

  await conversationModel.findByIdAndUpdate(conversationId, {
    lastMessage: newMessage._id,
    updatedAt: new Date(),
  });

  // await pusherServer.trigger(conversationId, "new-message", newMessage);

  return JSON.parse(JSON.stringify(newMessage));
}
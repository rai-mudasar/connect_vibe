"use server";

import connectToDb from "@/lib/dbConnect";
import { pusherServer } from "@/lib/pusher";
import userModel from "@/models/userModel";
import messageModel from "@/models/messageModel";
import conversationModel from "@/models/conversationModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getSessionUser } from "./userActions";

export async function getFriends(loggedInUserId) {
  await connectToDb();
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

export async function getInitialChatData(conversationId) {
  if (!conversationId) return;
  try {
    const sessionUser = await getSessionUser();


    const [messages, conversation] = await Promise.all([
      messageModel.find({ conversationId }).sort({ createdAt: 1 }),
      conversationModel.findById(conversationId).populate('participants', 'firstName lastName')
    ])

    const chattingPartner = (JSON.parse(JSON.stringify(conversation.participants[0]._id)) !== sessionUser.id) ? conversation.participants[0] : conversation.participants[1];
    
    return {
      success: true,
      message: "Successfully executed",
      data: JSON.parse(JSON.stringify({ "chattingUser": chattingPartner, "messages": messages }))
    };

  } catch (error) {
    return {
      success: false,
      message: `Error in getting initial chat data action : ${error.message || error}`,
    }
  }
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

  await pusherServer.trigger(conversationId, "new-message", newMessage);

  return JSON.parse(JSON.stringify(newMessage));
}
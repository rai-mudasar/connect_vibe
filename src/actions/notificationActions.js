"use server";

import { pusherServer } from "@/lib/pusher";
import notificationModel from "@/models/notificationModel";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "./userActions";
import { connection } from "next/server";
import userModel from "@/models/userModel";

export async function sendNotification(senderId, receiverId, notificationType, redirectUrl) {
  if (!senderId || !receiverId || !notificationType || !redirectUrl) {
    throw new Error("Invalid notification parameters");
  } else if (senderId === receiverId) {
    return;
  } else if (
    notificationType !== "LIKE" &&
    notificationType !== "UNLIKE" &&
    notificationType !== "FRIEND_REQUEST" &&
    notificationType !== "COMMENT"
  ) {
    throw new Error("Invalid notification type");
  }

  try {
    const [_, notification] = await Promise.all([
      getSessionUser(),
      notificationModel.create({
        recipientId: receiverId,
        senderId: senderId,
        type: notificationType,
        redirectUrl: redirectUrl,
      }),
    ]);

    const newNotification = await notificationModel
      .findById(notification._id)
      .populate("senderId", "firstName lastName profileImageUrl");

    // console.log('Before sending notification: ', newNotification);

    if (newNotification) {

      const pusherPayload = newNotification.toObject();

      await pusherServer.trigger(
        `user-${receiverId}`,
        "new-notification",
        pusherPayload
      );

      revalidatePath("/home");
    }
  } catch (error) {
    // console.error(`Error in sending notification ${error.message || error}`);
    throw new Error(`Error in sending notification ${error.message || error}`);
  }
}

export async function getLoggedInUserNotifications() {
  await connection()

  try {
    const sessionUser = await getSessionUser();
    const [notifications, loggedInUser] = await Promise.all([
      notificationModel
        .find({ recipientId: sessionUser.id })
        .populate("senderId", "username firstName lastName profileImageUrl")
        .sort({ createdAt: -1 })
        .lean(),

      userModel
        .findById(sessionUser.id)
        .select('username firstName lastName profileImageUrl email bio location occupation relationshipStatus')
        .lean()
    ])

    return {
      success: true,
      message: "Notification Fetched",
      data: {
        notifications: JSON.parse(JSON.stringify(notifications)),
        loggedInUser: JSON.parse(JSON.stringify(loggedInUser)),
        isAdmin: sessionUser.role === 'admin'
      }
    };
  } catch (error) {
    console.error(`Error in getLoggedInUserNotifications action : ${error.messsage || error}`);

    return {
      success: false,
      message: `Error in getLoggedInUserNotifications action : ${error.messsage || error}`,
    };
  }
}

export async function readNotificationById(notificationId) {
  if (!notificationId) throw new Error('No NotificationId Received!')

  try {
    const [_, updatedNotification] = await Promise.all([
      getSessionUser(),
      notificationModel.findByIdAndUpdate(
        notificationId,
        {
          isRead: true,
        },
      )
    ]);

    if (!updatedNotification) throw new Error("Invalid NotificationId or Notification not found!")

    return {
      success: true,
      message: "Read succcessfully",
    };
  } catch (error) {
    console.error(`Error in readNotificationById action : ${error.message || error}`);

    return {
      success: false,
      message: `Error in readNotificationById action : ${error.message || error}`,
    };
  }
};

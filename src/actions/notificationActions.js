"use server";

import connectToDb from "@/lib/dbConnect";
import { pusherServer } from "@/lib/pusher";
import notificationModel from "@/models/notificationModel";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "./userActions";

export async function sendNotification(senderId, receiverId, notificationType, redirectUrl) {
  if (!senderId || !receiverId || !notificationType || !redirectUrl) {
    throw new Error("Invalid notification parameters")

  } else if (senderId === receiverId) {
    throw new Error("Same user notification not recommended")

  } else if (
    notificationType !== "LIKE" &&
    notificationType !== "UNLIKE" &&
    notificationType !== "FRIEND_REQUEST" &&
    notificationType !== "COMMENT"
  ) {
    throw new Error("Invalid notification type")
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
    ])

    if (notification) {
      await pusherServer.trigger(
        `user-${receiverId}`,
        "new-notification",
        notification,
      );

      revalidatePath("/home");
    }
  } catch (error) {
    console.error(`Error in sending notification ${error.message || error}`);
    throw new Error(`Error in sending notification ${error.message || error}`)
  }
}

export async function getLoggedInUserNotifications(loggedInUserId) {
  if (!loggedInUserId) {
    return {
      success: false,
      message: "No receipient Id",
    };
  }

  try {
    await connectToDb()
    const notifications = await notificationModel
      .find({
        recipientId: loggedInUserId,
      })
      .populate("senderId", "firstName lastName profileImageUrl")
      .lean();

    if (notifications) {
      return {
        success: true,
        message: "Notification Fetched",
        data: JSON.parse(JSON.stringify(notifications)),
      };
    } else {
      return {
        success: true,
        message: "Notification Fetched Null",
        data: [],
      };
    }
  } catch (error) {
    console.log("Error in notification fetch action : ", error);

    return {
      success: false,
      message: `Error in notification fetch action : ${error.messsage}`,
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
    console.log(`Error in readNotificationById action : ${error.message || error}`);

    return {
      success: false,
      message: `Error in readNotificationById action : ${error.message || error}`,
    };
  }
};

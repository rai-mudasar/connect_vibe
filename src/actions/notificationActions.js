"use server";

import connectToDb from "@/lib/dbConnect";
import { pusherServer } from "@/lib/pusher";
import notificationModel from "@/models/notificationModel";
import { revalidatePath } from "next/cache";

export async function sendNotification(senderId, receiverId, notificationType) {
  if (!notificationType || !receiverId || !senderId) {
    return {
      success: false,
      message: "Invalid notification parameters",
    };
  }else if(senderId === receiverId){
    return {
      success: true,
      message: "Same user notification not recommended",
    };
  } else if (
    notificationType !== "LIKE" &&
    notificationType !== "FRIEND_REQUEST" &&
    notificationType !== "COMMENT"
  ) {
    return {
      success: false,
      message: "Invalid notification type",
    };
  }

  try {
    await connectToDb();

    const notification = await notificationModel.create({
      recipientId: receiverId,
      senderId: senderId,
      type: notificationType,
    });

    if (notification) {
      await pusherServer.trigger(
        `user-${receiverId}`,
        "new-notification",
        notification,
      );

      revalidatePath("/home");

      return {
        success: true,
        message: "Notification sent successfully",
      };
    }
  } catch (error) {
    console.log("Error in sending notification: ", error);

    return {
      success: false,
      message: "Error in sending notification" || error.message,
    };
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
  if (!notificationId) {
    return {
      success: false,
      message: "No NotificationId Received!",
    };
  }
  try {
    const updatedNotification = await notificationModel.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
      },
    );

    if (!updatedNotification) {
      return {
        success: false,
        message: "Invalid NotificationId Received!",
      };
    }
    return {
      success: true,
      message: "Read succcessfully",
    };
  } catch (error) {
    console.log("Error in notification by id read action : ", error);

    return {
      success: false,
      message: `Error in notification by id read action : ${error.message}`,
    };
  }
};

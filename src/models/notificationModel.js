import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      enum: ["LIKE", "FRIEND_REQUEST", "COMMENT"],
      required: true,
    },
    link: { 
        type: String 
    },
    isRead: { 
        type: Boolean, default: false 
    },
  },
  { timestamps: true },
);

const notificationModel = mongoose.models.notification || mongoose.model("notification", notificationSchema);

export default notificationModel;

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    isRead: { 
      type: Boolean, 
      default: false 
    },
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      }
    ],
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      }
    ],
  },
  { timestamps: true },
);

messageSchema.index({ conversationId: 1, createdAt: -1 });

const messageModel =
  mongoose.models.message || mongoose.model("message", messageSchema);

export default messageModel;
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    text: String,
  },
  { timestamps: true },
);

const messageModel =
  mongoose.models.message || mongoose.model("message", messageSchema);

export default messageModel;

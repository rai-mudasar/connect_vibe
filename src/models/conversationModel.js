import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId, ref: "user" 
      }
    ],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
    },
  },
  { timestamps: true },
);

const conversationModel =
  mongoose.models.conversation ||
  mongoose.model("conversation", conversationSchema);

export default conversationModel;

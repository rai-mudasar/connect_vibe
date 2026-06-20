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

  deletedFor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: []
    }
  ]
},
  { timestamps: true },
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ deletedFor: 1 });

const conversationModel =
  mongoose.models.conversation ||
  mongoose.model("conversation", conversationSchema);

export default conversationModel;
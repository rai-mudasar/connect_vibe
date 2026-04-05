import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: "New" },
    lastName: { type: String, default: "User" },
    username: { type: String, required: [true, "Please enter a username"] },
    email: { type: String, required: [true, "Please enter a email"] },
    password: { type: String, required: [true, "Please enter a password"] },
    profileImageUrl: { type: String },
    isVerified: { type: Boolean },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    verificationOtp: { type: Number },
    verificationOtpExpiry: { type: Date },

    coverImageUrl: { type: String },
    bio: { type: String, maxLength: 160, default: "No bio ever added" },
    location: { type: String, default: "None" },
    occupation: { type: String, default: "None" },
    relationshipStatus: {
      type: String,
      enum: ["Single", "In a relationship", "Married", "Engaged", "None"],
      default: "None",
    },

    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    friendRequestsReceived: [
      { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    ],

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],

    notifications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "notification" },
    ],

    privacy: {
      profileVisibility: {
        type: String,
        enum: ["public", "friends", "private"],
        default: "public",
      },
      showEmail: { type: Boolean, default: false },
    },

    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;

import mongoose from "mongoose"


const postSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    media: { type: String },
    mediaType: { type: String, enum: ["image", "video"] },
    caption: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    commentsCount: { type: Number, default: 0 },
    privacy: {
        type: String,
        enum: ["everyone", "friends", "onlyme"],
        default: "everyone",
    }
}, { timestamps: true });

const postModel = mongoose.models.post || mongoose.model("post", postSchema);

export default postModel;
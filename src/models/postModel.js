import mongoose from "mongoose"


const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    media: {
        type: String,
    },

    mediaType: {
        type: String,
        enum: ["image", "video"],
        required: true
    },

    caption: {
        type: String,
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
}, {timestamps: true});

const postModel = mongoose.models.post || mongoose.model("post", postSchema);

export default postModel;
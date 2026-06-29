import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true,
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },

    content: {
        type: String,
        required: true,
        trim: true
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],

    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
        default: null,
    },

    repliesCount: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

// CRITICAL INDEXES FOR FACEBOOK FEED PERFORMANCE
// 1. Jab hum kisi post ke comments load karein, toh top-level comments pehle load hon fast parsing ke sath.
commentSchema.index({ postId: 1, parentId: 1, createdAt: -1 });

// 2. Jab hum kisi specific comment ke replies open karein 'View more replies' par click karke.
commentSchema.index({ parentId: 1, createdAt: 1 });

const commentModel = mongoose.models.comment || mongoose.model('comment', commentSchema);

export default commentModel;
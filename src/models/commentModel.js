import mongoose from "mongoose"

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
    }

}, { timestamps: true })

const commentModel = mongoose.models.comment || mongoose.model('comment', commentSchema);

export default commentModel;
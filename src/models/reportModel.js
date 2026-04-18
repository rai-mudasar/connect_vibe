import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contentType: { type: String, enum: ['post', 'comment', 'user', 'message'] },
    contentId: mongoose.Schema.Types.ObjectId,
    reason: { type: String, enum: ['spam', 'hate_speech', 'misinformation', 'inappropriate', 'fake_account'] },
    description: String,
    status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' },
}, { timestamps: true });

export default mongoose.models.report || mongoose.model('report', reportSchema);
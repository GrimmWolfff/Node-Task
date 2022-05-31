import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    commentedAt: {
        required: true,
        type: Date,
        default: Date.now()
    },
    commenter: {
        type: String
    },
    postId: {
        type: String
    }
});
const Comment = new mongoose.model('Comment', CommentSchema);
export default Comment;
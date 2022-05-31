import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    postedAt: {
        required: true,
        type: Date,
        default: Date.now()
    },
    author: {
        type: String
    },
    categories: {
        type: [String],
        default: []
    }
});

const Post = new mongoose.model('Post', PostSchema);
export default Post;
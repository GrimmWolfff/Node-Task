import Post from '../models/post.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

export const fetchPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.json({ posts });
    } catch (error) {
        res.json(error);
    }
};

export const createPost = async (req, res) => {
    const { title, categories } = await req.body;
    const findDuplicates = arry => arry.filter((item, index) => arry.indexOf(item) !== index)
    if(findDuplicates(categories) == []) {
        await res.json('Categories are duplicated');
    } else {
        const token = await req.headers.authorization.split` `[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user._id);
        const { username, email } = await user;
        const newPost = await new Post({ title, categories, author: username });
        try {
            sendEmail({
                to: email,
                subject: 'New Post',
                text: `${username} created new post at ${new Date()}`
            });
            await newPost.save();
            res.json({ newPost })
        } catch (error) {
            res.json(error);
        }
    }
};


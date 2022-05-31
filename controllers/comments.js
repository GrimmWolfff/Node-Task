import Comment from '../models/comment.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

export const getMostActiveCommenters = async (req, res) => {
    const comments = await Comment.find();
    /* Fetching all comments, then getting only authors, then filtering the most 10 frequent authors */
    let allComments = [], topten = [];
    for(let i in comments) {
        allComments.push(comments[i].commenter)
    }
    const getTheMostCommenter = (array) =>
        array.reduce(
        (acc, item) =>
            array.filter((v) => v === acc).length >=
            array.filter((v) => v === item).length
            ? acc
            : item,
        null
    );
    for(let i = 0; i < 10; i++) {
        let top = getTheMostCommenter(allComments);
        topten.push(top);
        allComments = allComments.filter(el => el != top);
    }
    res.json(topten.filter(el => el != null));
}

export const createComment = async (req, res) => {
    const { body: { content }, params: { id } } = req;
    const token = await req.headers.authorization.split` `[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user._id);
    const username = await user.username;
    const newComment = await new Comment({ content:content, commenter: username, postId: id });
    try {
        sendEmail({
            to: process.env.EMAIL_FROM,
            subject: 'New Comment',
            text: `${username} commented on a post ${id} at ${new Date()}`
        });
        await newComment.save();
        res.json(newComment);
    } catch (error) {
        res.json(error);        
    }
}
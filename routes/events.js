import express from 'express';
import { Auth } from '../middlewares/auth.js';
import { fetchPosts, createPost } from '../controllers/posts.js';
import { createComment, getMostActiveCommenters } from '../controllers/comments.js';

const eventsRouter = express.Router();

eventsRouter.get('/', Auth, fetchPosts);
eventsRouter.post('/', Auth, createPost);
eventsRouter.post('/comment/:id', Auth, createComment);
eventsRouter.get('/actives', getMostActiveCommenters);

export default eventsRouter;
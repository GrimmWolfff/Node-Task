import express from 'express';
import { register, login, getUser } from '../controllers/auth.js';
const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.post('/register', register);
userRouter.get('/getuser', getUser);

export default userRouter;
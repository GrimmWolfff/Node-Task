import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const Auth = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split` `[1];
    }
    if(!token) {
        return next(new Error('Not authorized'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user._id);
        if(!user) {
            return next(new Error('User is not authorized'));
        }
        req.user = user;
        next(); 
    } catch (error) {
        return next(error);
    }
}
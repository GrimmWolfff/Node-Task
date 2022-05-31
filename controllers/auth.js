import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

export const login = async (req, res) => {
    const { password, email } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) return res.status(404).json("Invalid Credentials");
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json('Your password is incorrect');
        }
        const payload = { user: { _id: user._id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
        res.status(200).json({ token });
    } 
    catch (error) {
        res.status(500).json(error);
    }
}

export const register = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        let user = await User.findOne({ username });
        let euser = await User.findOne({ email }); 
        if(user||euser) {
            return res.json('User already exists');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = new User({ email, username, password: hashedPassword })
            try {
                sendEmail({
                    to: process.env.EMAIL_FROM,
                    subject: 'New User registered',
                    text: `New user registered with email of ${email} at ${new Date()}`
                });
                const newUser = await user.save();
                res.json({ newUser })
            } catch (error) {
                res.json(error);
            }    
        }
        // const payload = { user: { _id: newUser._id } };
        // const token = jwt.sign(payload, process.env.JWT_SECRET);
        // res.json({token});
    } catch (error) {
        res.status(500).json({ error });
    }
}

export const getUser = async (req, res) => {
    const token = await req.headers.authorization.split` `[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user._id);
    const username = await user.username;
    res.json({ username });
}
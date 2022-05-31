import 'dotenv/config';
import express from 'express';
const app = express();
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRouter from './routes/auth.js';
import eventsRouter from './routes/events.js';

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});
app.use('/api/auth', userRouter);
app.use('/api/posts', eventsRouter);

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true }, () => {
    console.log('Connected to the database');
});
app.listen(process.env.PORT, () => {
    console.log(`Server has successfully been started at ${process.env.PORT}`)
})
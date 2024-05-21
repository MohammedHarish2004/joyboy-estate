import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import listingRouter from './routes/listing.routes.js'
import cookieParser from 'cookie-parser'

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
})

const app = express()

app.listen(3000,()=>{
    console.log("Server running on port 3000");
})

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/listing',listingRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
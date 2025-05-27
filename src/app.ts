import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose';

dotenv.config()
const app = express();
app.use(express.json());
app.use(cookieParser())

const PORT = process.env.PORT || 5000;

const startServer = async()=>{
    try{
        await connectToServer();
        app.listen(PORT,()=>{
            console.log(`App is listening to PORT : ${PORT}`)
        })
    }catch(err){
        console.log(err);
        process.exit(1)
    }
}

const connectToServer = async()=>{
    await mongoose.connect(`${process.env.DATABASE_URL}`)
    return;
}
startServer()
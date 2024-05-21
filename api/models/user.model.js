import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    avatar:{
        type:String,
        default:'https://www.shareicon.net/data/2016/09/01/822739_user_512x512.png'
    }
},{timestamps:true})

const User = mongoose.model('User',userSchema)

export default User
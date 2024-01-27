import e from "express";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
    },
    google:{
        type:Boolean,
        default:false
    }
    
},{timestamps:true});

const User = mongoose.model('User',userSchema);
export default User;
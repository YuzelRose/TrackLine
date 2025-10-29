import mongoose from 'mongoose';

const UserModel = new mongoose.Schema({
    Name:{
        type:String,
        required: true,
    },
    Email:{
        type:String,
        required: true,
        unique:true,
        lowercase: true,
    },
    Pass:{
        type:String,
        required:true,
    },
    CRUP:{
        type:String,
        required:true,
        unique:true,
    },
    Birth:{
        type:String,
        required:true,
    },

},{collection:'User'});

const User = mongoose.model('User',UserModel);
export default User;

import mongoose from "mongoose";

const ContentModel = new mongoose.Schema({
    _id:{
        type:String,
        required: true,
    },
    Name:{
        type:String,
        required: true,
    },
    Time:{
        type:String,
        required: true,
        default:Date.now,
    },
    Add:{
        type:Array,
        required:true,
    },

},{collection:'Content'});

const Content = mongoose.model('Content',ContentModel);
export default Content;
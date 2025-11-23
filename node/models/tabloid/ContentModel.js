import mongoose from "mongoose";

const ContentModel = new mongoose.Schema({
    Name:{
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true
    },
    data: {
        type: Buffer
    },
    uploadDate: { 
        type: Date, 
        default: Date.now 
    }
},{collection:'content'});

const Content = mongoose.model('Content',ContentModel);
export default Content;
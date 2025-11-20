import mongoose from "mongoose";

const NoticeModel = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    },
    Content: {
        contentType: { type: String, enum: ['text', 'file', 'link'] },
        value: String,
        filename: String
    },
    CreatedAt: { type: Date, default: Date.now },
}, { collection: 'notice' });

const Notice = mongoose.model('Notice', NoticeModel);
export default Notice;
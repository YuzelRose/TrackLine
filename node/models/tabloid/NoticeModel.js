import mongoose from "mongoose";

const NoticeModel = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    },
    Files: [{
        file: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'content' 
        },
    }],
    Content: {
        contentType: { type: String, enum: ['text', 'file', 'link'], default: 'text' },
        value: { type: String, default: '' },
        filename: { type: String, default: '' }
    },
    CreatedAt: { type: Date, default: Date.now },
}, { collection: 'notice' });

const Notice = mongoose.model('Notice', NoticeModel);
export default Notice;
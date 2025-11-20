import mongoose from "mongoose";

const AssigmentModel = new mongoose.Schema({
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
    DueDate: { 
        type: Date, 
        required: true 
    },
    CreatedAt: { 
        type: Date, 
        default: Date.now
    },
    Submissions: [{
        Student: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Student', 
            required: true
        },
        Status: {
            type: String, 
            enum: ['pending', 'submitted', 'graded', 'late'], 
            default: 'pending' 
        },
        SubmittedWork: {
            contentType: { type: String, enum: ['text', 'file', 'link'] }, 
            value: String,
            filename: String,
            submittedAt: { type: Date, default: Date.now }
        },
        Grade: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        Feedback: { 
            type: String,
            default: ''
        },
        GradedAt: {
            type: Date
        }
    }]
}, { collection: 'assigment' });

const Assigment = mongoose.model('Assigment', AssigmentModel);
export default Assigment;
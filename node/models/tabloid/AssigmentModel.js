import mongoose from "mongoose";

const AssigmentModel = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    },
    Text: {
        type: String,
        required: true
    },
    DueDate: { 
        type: Date, 
        required: true 
    },
    CreatedAt: { 
        type: Date, 
        default: Date.now
    },
    Content: [{
        file: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'content' 
        },
    }],
    Submissions: [{
        Student: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Student', 
            required: true
        },
        Status: {
            type: String, 
            enum: ['Pendiente', 'Entregado', 'Tarde'], 
            default: 'Pendiente' 
        },
        SubmittedWork: [{
            file: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'content' 
            },
        }],
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
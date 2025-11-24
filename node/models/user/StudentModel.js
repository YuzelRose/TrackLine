import mongoose from 'mongoose';
import User from './UserModel.js';

const studentSchema = new mongoose.Schema({
    payments: [{
        payRef: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Pay', 
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending'
        }
    }],
    kardex: {
        type: String,
        required: true,
        unique: true
    },
    RelatedEmail: {
        type: String,
    },
    Badges: [{
        refId: {
            type: String
        }
    }],
    Tabloids: [{
        refId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Tabloid', 
            required: true
        }
    }],
});

const Student = User.discriminator('student', studentSchema);
export default Student;
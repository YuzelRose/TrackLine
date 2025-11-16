import mongoose from 'mongoose';
import User from './UserModel.js';

const studentSchema = new mongoose.Schema({
    Pays: [{
        NRef: {
            type: String,
            required: true,
            unique: true
        }
    }],
    kardex: {
        type: String,
        required: true,
        unique: true
    },
    RelatedEmail: {
        type: String,
    }
});

const Student = User.discriminator('student', studentSchema);
export default Student;
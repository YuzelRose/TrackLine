import mongoose from 'mongoose';

import User from './UserModel';

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
    }
});

const Student = User.discriminator('student', studentSchema);
export default Student;
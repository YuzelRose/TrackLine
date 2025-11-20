import mongoose from 'mongoose';
import User from './UserModel.js';

const tutorSchema = new mongoose.Schema({
    Phone: {
        type: String,
        required: true,
    },
    RelatedEmail: {
        type: String,
    }
});

const Tutor = User.discriminator('tutor', tutorSchema);
export default Tutor;
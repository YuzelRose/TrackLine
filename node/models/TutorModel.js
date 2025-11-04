import mongoose from 'mongoose';

import User from './UserModel';

const tutorSchema = new mongoose.Schema({
    Phone: {
        type: String,
        required: true,
    },
    RelatedEmail: {
        type: String,
        required: true,
    }
});

const Tutor = User.discriminator('tutor', tutorSchema);
export default Tutor;
import mongoose from 'mongoose';
import User from './UserModel.js';

const profesorSchema = new mongoose.Schema({
    RFC: {
        type: String,
        required: true,
        unique: true,
    },
    NCount: {
        type: String,
        required: true,
        unique: true,
    },
    Cedula: {
        type: String,
        required: true,
    },
    Tabloids:[{
        refId:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Tabloid', 
            required: true
        },
    }]
});

const Profesor = User.discriminator('profesor', profesorSchema);
export default Profesor;
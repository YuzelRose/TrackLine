import mongoose from 'mongoose';

const TutorModels = new mongoose.Schema({
    Name:{
        type:String,
        required: true,
    },
    Email:{
        type:String,
        required: true,
        unique:true,
        lowercase: true,
    },
    Pass:{
        type:String,
        required:true,
    },
    Phone:{
        type:String,
        required:true,
    },
    RelatedEmail:{
        type:String,
        required:true,
    }

},{collection:'tutor'});

const Tutor = mongoose.model('Tutor',TutorModels);
export default Tutor;

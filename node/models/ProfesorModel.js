import mongoose from 'mongoose';

const ProfesorModel = new mongoose.Schema({
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
    CRUP:{
        type:String,
        required:true,
        unique:true,
    },
    RFC:{
        type:String,
        required:true,
        unique:true,
    },
    NCount:{
        type:String,
        required:true,
        unique:true,
    },
    Birth:{
        type:String,
        required:true,
    },
    Cedula:{
        type:String,
        required:true,
    },

},{collection:'profesor'});

const Profesor = mongoose.model('Profesor',ProfesorModel);
export default Profesor;
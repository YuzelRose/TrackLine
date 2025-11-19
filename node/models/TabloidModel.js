import mongoose from 'mongoose';
const TabloidModel = new mongoose.Schema({
    Name:{
        type:String,
        required: true,
    },
    Owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description:{
        type:String,
        required:true,
    },
    HomeWork:[{
        refId: {
            type: String,
            required: true,
        },
        Name: {
            type: String,
            required: true,
            unique: true
        },
        Content:{
            type: { type: String, enum: ['text', 'file', 'link'] },
            value: String,
            filename: String
        },
        DueDate: { type: Date, required: true },
        CreatedAt: { type: Date, default: Date.now },
        Status: { 
            type: String, 
            enum: ['active', 'completed', 'cancelled'], 
            default: 'active' 
        }
    }]
},{collection:'tabloid'});

const Tabloid = mongoose.model('Tabloid',TabloidModel);
export default Tabloid;
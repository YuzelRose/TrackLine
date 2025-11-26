import mongoose from "mongoose";
const TabloidModel = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    HomeWork: [{
        notice: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'notice' 
        },
        assigment: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'assigment' 
        }
    }],
    requiredPayment: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pay', 
        required: true
    }]
}, { 
    collection: 'tabloid',
});


const Tabloid = mongoose.model('Tabloid', TabloidModel);
export default Tabloid;
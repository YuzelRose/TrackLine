import mongoose from 'mongoose';

const PayModel = new mongoose.Schema({
    amount: { 
        type: Number,
        required: true
    },
    date: {   
        type: Date,
        default: Date.now
    },
    status: {  
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    userId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {  
        type: String,
        required: true
    },
    tabloidId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tabloid',
        required: true
    },
}, { 
    collection: 'Pay',
    timestamps: true 
});

const Pay = mongoose.model('Pay', PayModel);
export default Pay;
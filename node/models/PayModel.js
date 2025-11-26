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
    description: {  
        type: String,
        required: true
    },
    tabloidId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tabloid',
    },
}, { 
    collection: 'Pay',
    timestamps: true 
});

const Pay = mongoose.model('Pay', PayModel);
export default Pay;
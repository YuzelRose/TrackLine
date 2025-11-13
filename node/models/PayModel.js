import mongoose from 'mongoose';

const PayModel = new mongoose.Schema({
    NRef: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    Amaunt: [{
        type: Number,
        required: true
    }],
    Date: [{
        type: Date,
        default: Date.now
    }],
    State: [{
        type: String,
        enum: ['pendiente', 'completado', 'fallido'],
        default: 'pendiente'
    }],
}, { collection: 'Pay' });

const Pay = mongoose.model('Pay',PayModel);
export default Pay;

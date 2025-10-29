import mongoose from 'mongoose';

const PayModel = new mongoose.Schema({
    UserRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
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
    referencia: [{
        type: String
    }]
}, { collection: 'Pay' });

const Pay = mongoose.model('Pay',PayModel);
export default Pay;

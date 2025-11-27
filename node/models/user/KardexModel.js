import mongoose from "mongoose";

const kardexSchema = new mongoose.Schema({
    Courses: [{
        courseID: {
            type: String,
        },
        name: {
            type: String,
        },
        grade: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        status: {
            type: String,
            enum: ['En curso', 'Aprobado', 'Reprobado', 'Incompleto'],
            default: 'En curso'
        }

    }],
    Average: { 
        sum: {
            type: Number,
            default: 0
        },
        count: {  
            type: Number,
            default: 0
        },
        final: { 
            type: Number,
            default: 0
        }
    },
    totalCredits: {
        type: Number,
        default: 0
    }

}, { 
    collection: 'kardex',
    timestamps: true 
});
const Kardex = mongoose.model('Kardex', kardexSchema);
export default Kardex;
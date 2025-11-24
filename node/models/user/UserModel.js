import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    Pass: {
        type: String,
        required: true,
    },
    CURP: {
        type: String,
        required: true,
        unique: true,
    },
    Birth: {
        type: String,
        required: true,
    },
    UserType: {
        type: String,
        enum: ['student', 'profesor', 'tutor'],
        required: true
    }
}, { 
    collection: 'users',
    discriminatorKey: 'UserType'  // ← Clave que discrimina el tipo
});

const User = mongoose.model('User', UserSchema);
export default User;

/*
colection name: users
"Name": "Javier",
"Email": "zelinkmd@gmail.com",
"Pass": "1234",
"CURP": "adawdd2q4ds",
"Birth": "09-03-2005",
"userType": "student"
*/
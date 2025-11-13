import mongoose from 'mongoose';
import { MONGO_URL } from '../config.js';

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('base de datos ejecutando');
})
.catch(err => {
    console.error('Error de conexión a base de datos:', err);
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Conexión a la base de datos establecida');
});

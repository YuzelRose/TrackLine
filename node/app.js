import express from 'express';
import cors from 'cors';
import './database/MongoConex.js'; 

import ContentRoutes from './routes/ContentRoutes.js';
import PayRoutes from './routes/PayRoutes.js';
import UserRoutes from './routes/UserRoutes.js';
import TutorRoutes from './routes/TutorRoutes.js';
import ProfesorRoutes from './routes/ProfesorRoutes.js';
import TabloidRoutes from './routes/TabloidRoutes.js';

import { REQUEST_URL, BACK_POT, WWW_TRACT_ORIGIN, TRACT_ORIGIN } from './config.js';

const app = express();

app.use(cors({
    origin: [
        'http://localhost:3000',
        WWW_TRACT_ORIGIN,
        TRACT_ORIGIN
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());

app.use(`${REQUEST_URL}/pay`, PayRoutes)
app.use(`${REQUEST_URL}/user`, UserRoutes);
app.use(`${REQUEST_URL}/tutor`, TutorRoutes);
app.use(`${REQUEST_URL}/profesor`, ProfesorRoutes);
app.use(`${REQUEST_URL}/tabloid`, TabloidRoutes);
app.use(`${REQUEST_URL}/content`, ContentRoutes)

app.listen(BACK_POT, '0.0.0.0', () => {
    console.log(`Servidor en ejecución, puerto: ${BACK_POT}`);
});
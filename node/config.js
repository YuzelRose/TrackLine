import dotenv from 'dotenv';
dotenv.config();

//Llave de gmail:
export const GMAIL_PASS = process.env.GMAIL_PASS || 'Defined in .env'
export const REQUEST_URL = process.env.REQUEST_URL || '/trckln';
export const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/trckln';
export const BACK_POT = process.env.BACK_POT || 5000

export const  TRACT_Server = process.env.WWW_TRACT_ORIGIN || 'notDefined'; // IP del sercidor
// URLS
export const  WWW_TRACT_ORIGIN = process.env.WWW_TRACT_ORIGIN || 'http://www.trackline.com';
export const  TRACT_ORIGIN = process.env.TRACT_ORIGIN || 'http://trackline.com';
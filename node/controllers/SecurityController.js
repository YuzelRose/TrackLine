import crypto from 'crypto';
import { console } from 'inspector';
import { sendToken } from '../utils/email.js';

export const sendTok = (req, res) => {
    try {
        const tok = crypto.randomBytes(32).toString('hex')
        sendToken(tok)
        res.status(200).json({token:tok})
    } catch (error) {
        console.error(error)
    } 
}
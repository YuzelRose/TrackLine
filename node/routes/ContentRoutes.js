import express from 'express';
import { helpMail } from '../controllers/MailController.js';

const router = express.Router();

router.post('/Help', helpMail);

export default router;
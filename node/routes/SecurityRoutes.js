import express from 'express';

import { sendTok } from '../controllers/SecurityController.js';

const router = express.Router();

router.post('/get-tok', sendTok);    

export default router;
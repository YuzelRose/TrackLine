import express from 'express';

import { sendHelp, sendTok } from '../controllers/SecurityController.js';

const router = express.Router();

router.post('/get-tok', sendTok);
router.post('/help',sendHelp)    

export default router;
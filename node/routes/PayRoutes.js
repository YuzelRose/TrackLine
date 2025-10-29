import express from 'express';
import { AlterPass, AlterDrop, getdata } from '../controllers/AlterUserController.js';

const router = express.Router();

router.post('/Pass', AlterPass);
router.post('/Drop', AlterDrop);
router.post('/getnset/:id', getdata);

export default router;
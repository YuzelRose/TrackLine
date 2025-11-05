import express from 'express';

import { postLogIn, postSupRegister }  from '../controllers/UserController.js'

const router = express.Router();

router.post('/login-attempt', postLogIn);
router.post('/frst-register', postSupRegister);


export default router;
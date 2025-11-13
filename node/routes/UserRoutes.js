import express from 'express';

import { postLogIn, postSupRegister, registerStudent, registerTutor }  from '../controllers/UserController.js'

const router = express.Router();

router.post('/login-attempt', postLogIn);
router.post('/frst-register', postSupRegister);
router.post('/register-student', registerStudent);
router.post('/register-tutor', registerTutor);

export default router;
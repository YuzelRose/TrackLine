import express from 'express';

import { postLogIn, MailRegister, registerStudent, registerTutor }  from '../controllers/UserController.js'

const router = express.Router();

router.post('/login-attempt', postLogIn);
router.post('/frst-register', MailRegister);
router.post('/register-student', registerStudent);
router.post('/register-tutor', registerTutor);

export default router;
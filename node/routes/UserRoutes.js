import express from 'express';

import { 
    login, 
    MailRegister, 
    registerStudent, 
    registerTutor, 
    registerTutorStudent 
}  from '../controllers/UserController.js'

const router = express.Router();

router.post('/login', login);
router.post('/frst-register', MailRegister);
router.post('/register-student', registerStudent);
router.post('/register-tutor', registerTutor);
router.post('/register-tutor-student', registerTutorStudent);

export default router;
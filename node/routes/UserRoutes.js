import express from 'express';
//import { getUserById, getUserByMail, postLogIn, updateUser, updatePass, DropCount, allUsers, ChangeCount } from '../controllers/UserController.js';

import { postLogIn, /*postRegister*/ }  from '../controllers/UserController.js'

const router = express.Router();

router.post('/login-attempt', postLogIn);
//router.post('/frst-register', postSupRegister);


export default router;
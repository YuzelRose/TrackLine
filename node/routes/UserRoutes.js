import express from 'express';
//import { getUserById, getUserByMail, postLogIn, updateUser, updatePass, DropCount, allUsers, ChangeCount } from '../controllers/UserController.js';

import {postLogIn}  from '../controllers/UserController.js'

const router = express.Router();

router.post('/LoginAttempt', postLogIn);

export default router;
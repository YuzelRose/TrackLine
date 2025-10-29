import express from 'express';
import { getUserById, getUserByMail, postLogIn, updateUser, updatePass, DropCount, allUsers, ChangeCount } from '../controllers/UserController.js';

const router = express.Router();

router.get('/', allUsers);

router.post('/login', postLogIn);
router.get('/:id', getUserById);
router.get('/find/:mail', getUserByMail);

router.put('/updatedata/:correo', updateUser);
router.put('/updatepass/:correo', updatePass);

router.put('/Update/:id', ChangeCount);
router.post('/Drop/:id', DropCount);

export default router;
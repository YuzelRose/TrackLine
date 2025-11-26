import express from 'express';

import { create, drop, findBy, update, getAll } from '../controllers/CrudController.js'

const router = express.Router();

router.post('/create', create);    // C
router.post('/find-by', findBy);   
router.post('/get-all', getAll);   // R
router.post('/update', update);    // U
router.post('/drop', drop);        // D

export default router;
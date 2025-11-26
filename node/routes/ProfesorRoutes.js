import express from 'express';

import { createProfesor, getAllProfesores, updateProfesorTabloids } from '../controllers/ProfesorController.js';

const router = express.Router();

router.post('/create', createProfesor);    
router.post('/get-all', getAllProfesores);   
router.post('/update', updateProfesorTabloids);   

export default router;
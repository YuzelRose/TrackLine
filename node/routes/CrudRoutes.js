import express from 'express';

import { create, drop, findBy, update, getAll, createTabloid, findByTabloid, getAllTabloids, updateTabloid, dropTabloid, getProfessors } from '../controllers/CrudController.js'

const router = express.Router();

router.post('/user/create', create);    // C
router.post('/user/find-by', findBy);   
router.post('/user/get-all', getAll);   // R
router.post('/user/update', update);    // U
router.post('/user/drop', drop);        // D

router.post('/tabloid/create', createTabloid);    
router.post('/tabloid/find-by', findByTabloid);   
router.post('/tabloid/get-all', getAllTabloids);   
router.post('/tabloid/update', updateTabloid);    
router.post('/tabloid/drop', dropTabloid);        
router.get('/tabloid/professors', getProfessors); 


export default router;
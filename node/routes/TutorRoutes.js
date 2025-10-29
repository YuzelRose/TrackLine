import express from 'express';
import { DropAutor, ChangeAutor ,getAutores, getAutorById, getAutorByName, getExactAutorByName, getSearchAutors } from '../controllers/AutorController.js';

const router = express.Router();

router.get('/', getAutores);

router.get('/id/:id', getAutorById);
router.get('/Name/:Name', getAutorByName);
router.get('/Exact/Name/:Name', getExactAutorByName);

router.put('/Update/:id', ChangeAutor);
router.post('/Drop/:id', DropAutor);
router.post('/search',getSearchAutors);

export default router;
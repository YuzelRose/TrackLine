import express from 'express';
import { 
    create, 
    getAll, 
    getById, 
    getProfesors, 
    deleteTabloid, 
    update 
} from '../controllers/tabloidController.js';

const router = express.Router();

// Rutas para tabloides
router.post('/tabloids', create);
router.get('/tabloids', getAll);
router.get('/tabloids/:id', getById);
router.put('/tabloids/:id', update);
router.delete('/tabloids/:id', deleteTabloid);

// Ruta para obtener profesores (para el selector)
router.get('/profesors', getProfesors);

export default router;
import express from 'express';
import { 
    create, 
    getAll, 
    getById, 
    update, 
    deleteStudent, 
    getByEmail,
    getByKardex 
} from '../controllers/StudentCrudController.js';

const router = express.Router();

// CREATE - Crear nuevo estudiante
router.post('/students', create);

// READ - Obtener todos los estudiantes
router.get('/students', getAll);

// READ - Obtener estudiante por ID
router.get('/students/:id', getById);

// READ - Obtener estudiante por email
router.get('/students/email/:email', getByEmail);

// READ - Obtener estudiante por kardex
router.get('/students/kardex/:kardex', getByKardex);

// UPDATE - Actualizar estudiante por ID
router.put('/students/:id', update);

// DELETE - Eliminar estudiante por ID
router.delete('/students/:id', deleteStudent);

export default router;
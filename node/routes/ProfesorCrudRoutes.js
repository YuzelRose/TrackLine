import express from 'express';
import { 
    create, 
    getAll, 
    getById, 
    update, 
    deleteProfesor, 
    searchByEmail,
    getByRFC
} from '../controllers/ProfesorCrudController.js';

const router = express.Router();

// CREATE - Crear nuevo profesor
router.post('/profesors', create);

// READ - Obtener todos los profesores
router.get('/profesors', getAll);

// READ - Obtener profesor por ID
router.get('/profesors/:id', getById);

// READ - Obtener profesor por email
router.get('/profesors/email/:email', searchByEmail);

// READ - Obtener profesor por RFC
router.get('/profesors/rfc/:rfc', getByRFC);

// UPDATE - Actualizar profesor por ID
router.put('/profesors/:id', update);

// DELETE - Eliminar profesor por ID
router.delete('/profesors/:id', deleteProfesor);

export default router;
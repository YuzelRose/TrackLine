import express from 'express';
import { 
    create, 
    getAll, 
    getById, 
    update, 
    deleteUser, 
    getByEmail 
} from '../controllers/CrudController.js';

const router = express.Router();

// CREATE - Crear nuevo usuario
router.post('/users', create);

// READ - Obtener todos los usuarios 
router.get('/users', getAll);

// READ - Obtener usuario por ID
router.get('/users/:id', getById);

// READ - Obtener usuario por email
router.get('/users/email/:email', getByEmail);

// UPDATE - Actualizar usuario por ID
router.put('/users/:id', update);

// DELETE - Eliminar usuario por ID
router.delete('/users/:id', deleteUser);

export default router;
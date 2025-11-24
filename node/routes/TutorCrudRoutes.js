import express from 'express';
import { 
    create, 
    getAll, 
    getById, 
    update, 
    deleteTutor, 
    getByEmail,
    getByPhone,
    getByRelatedEmail,
    getTutorsByStudentEmail
} from '../controllers/TutorCrudController.js';

const router = express.Router();

// CREATE - Crear nuevo tutor
router.post('/tutors', create);

// READ - Obtener todos los tutores
router.get('/tutors', getAll);

// READ - Obtener tutor por ID
router.get('/tutors/:id', getById);

// READ - Obtener tutor por email
router.get('/tutors/email/:email', getByEmail);

// READ - Obtener tutor por teléfono
router.get('/tutors/phone/:phone', getByPhone);

// READ - Obtener tutor por email relacionado
router.get('/tutors/related-email/:relatedEmail', getByRelatedEmail);

// READ - Obtener tutores por email de estudiante
router.get('/tutors/student/:studentEmail', getTutorsByStudentEmail);

// UPDATE - Actualizar tutor por ID
router.put('/tutors/:id', update);

// DELETE - Eliminar tutor por ID
router.delete('/tutors/:id', deleteTutor);

export default router;
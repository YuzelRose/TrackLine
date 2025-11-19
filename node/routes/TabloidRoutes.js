import express from 'express';
import { 
    addCoursesToUser,
    getCourses, 
    getData
} from '../controllers/TabloidController.js';

const router = express.Router();

router.post('/get-courses', getCourses);
router.post('/add-user', addCoursesToUser)
router.post('/get-data', getData)

export default router;
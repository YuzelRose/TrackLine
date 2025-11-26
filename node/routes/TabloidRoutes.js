import express from 'express'
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });
import { 
    addCoursesToUser,
    getCourses, 
    getData, 
    getHw,
    sendHw,
    getAll,
    addPay
} from '../controllers/TabloidController.js'

const router = express.Router()

router.post('/get-courses', getCourses)
router.post('/add-user', addCoursesToUser)
router.post('/get-data', getData)
router.post('/get-hw', getHw)
router.post('/send-hw', upload.array('workFiles'), sendHw);
router.post('/get-all', getAll)
router.post('/add-pay', addPay)

export default router
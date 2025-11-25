import express from 'express'

import { 
    changeData,
    dropUser,
    getUser,
    login, 
    MailRegister, 
    registerStudent, 
    registerTutor, 
    registerTutorStudent 
}  from '../controllers/UserController.js'

const router = express.Router()

router.post('/login', login)
router.post('/frst-register', MailRegister)
router.post('/register-student', registerStudent)
router.post('/register-tutor', registerTutor)
router.post('/register-tutor-student', registerTutorStudent)
router.post('/get-user', getUser)
router.post('/change-data', changeData)
router.post('/drop', dropUser)


export default router
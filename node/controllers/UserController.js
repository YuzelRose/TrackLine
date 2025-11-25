import User from '../models/user/UserModel.js';
import Student from '../models/user/StudentModel.js'
import Tutor from '../models/user/TutorModel.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendConfStudentMail, sendConfTutorMail, sendRegMail, sendTutorToStudentRegMail } from '../utils/email.js';

export const comparePasswords = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
}
const genTok = () => crypto.randomBytes(32).toString('hex')

const isUserAvailable = async (email) => { // true si está disponible, false si existe
    try {
        const existingUser = await User.findOne({ Email: email })
        return !existingUser
    } catch (error) {
        return false
    }
}

const hashData = async ({ curp, pass }) => {
    try {
        const result = {}
        if (pass) {
            const salt = await bcrypt.genSalt(10)
            const hashPass = await bcrypt.hash(pass, salt)
            result.pass = hashPass;
        }
        if (curp) {
            const iv = crypto.randomBytes(16)
            const cipher = crypto.createCipheriv(
                process.env.ALGORITHM, 
                Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), 
                iv 
            )
            let encrypted = cipher.update(curp, 'utf8', 'hex')
            encrypted += cipher.final('hex')
            const authTag = cipher.getAuthTag();
            
            result.CURP = {
                iv: iv.toString('hex'),        
                content: encrypted,
                authTag: authTag.toString('hex')
            }
        }
        return result;
    } catch(error) {
        console.error('Error en hashData:', error)
        return null
    }
}

const decryptCurp = (encryptedData) => {
    try {
        const decipher = crypto.createDecipheriv(
            process.env.ALGORITHM,
            Buffer.from(process.env.ENCRYPTION_KEY, 'hex'),
            Buffer.from(encryptedData.iv, 'hex') 
        )
        if (encryptedData.authTag) 
            decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'))
        let decrypted = decipher.update(encryptedData.content, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted;
    } catch(error) {
        console.error('Error al desencriptar CURP:', error)
        return null;
    }
}

export const MailRegister = async (req, res) => {
    try {
        const { email } = req.body
        if(!(await isUserAvailable(email))) {
            return  res.status(409).json({ message: 'Usuario ya registrado' })
        } else {
            const mail = await sendRegMail(email)
            if(mail.status === 200) {
                res.status(200).json({ 
                    message: 'Revise su correo', 
                    token: mail.token,
                    status: 200
                })
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const registerTutor = async (req, res) => {
    try {
        const { data } = req.body;
        if(!data) return res.status(400).json({ message: 'Sin infrmación' })
        const available = await isUserAvailable(data.email);
        if(!available) return res.status(409).json({ message: 'Usuario existente' })
        const hash = await hashData({
            curp: data.curp,
            pass: data.pass
        })
        if(data.pass === data.passConfirm && !!hash) {
            const registerData = {
                Name: data.name,
                Email: data.email,
                Pass: hash.pass,
                CURP: hash.CURP,
                Birth: data.birth,
                UserType: "tutor",
                Phone: data.phone,
                RelatedEmail: null
            }
            const userData = await Tutor.create(registerData);
            if(userData) {
                if(data.relatedEmail) {
                    const mail = await sendTutorToStudentRegMail({
                        studentMail: data.relatedEmail,
                        tutorMail: data.email
                    })
                    if(mail.status === 200) {
                        return res.status(201).json({
                            message: "Tutor registrado, revise el correo del estudiante", 
                            status: 201,
                            token: mail.token
                        })
                    }
                }
                return res.status(201).json({
                    message: "Tutor registrado correctamente", 
                    status: 201
                })
            }
        } else return res.status(400).json({ message: 'Las contraseñas no coinciden' })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const registerTutorStudent = async (req, res) => {
    try {
        const { data } = req.body;
        if(!data) return res.status(400).json({ message: 'Sin información' })
        const available = await isUserAvailable(data.email)
        if(!available) return res.status(409).json({ message: 'Usuario existente' })
        const tutor = await User.findOne({ Email: data.relatedEmail })
        if(!tutor) return res.status(404).json({ message: 'La cuenta del tutor no existe' })
        const hash = await hashData({
            curp: data.curp,
            pass: data.pass
        })
        if(data.pass === data.passConfirm && !!hash) {
            const registerData = {
                Name: data.name,
                Email: data.email,
                Pass: hash.pass,
                CURP: hash.CURP,
                Birth: data.birth,
                UserType: "student",
                Pays: [],
                kardex: `KARDEX${data.email}`,
                RelatedEmail: data.relatedEmail,
                Tabloids: [],
                Badges: []
            }
            const userData = await Student.create(registerData)
            tutor.RelatedEmail = data.email
            await tutor.save()
            if(userData) {
                await sendConfTutorMail(data.relatedEmail)
                await sendConfStudentMail(data.email)
                return res.status(201).json({
                    message: "Usuario creado correctamente", 
                    status: 201
                })
            }
        } else  return res.status(400).json({ message: 'Las contraseñas no coinciden' })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const registerStudent = async (req, res) => {
    try {
        const { data } = req.body;
        if(!data) return res.status(400).json({ message: 'Sin información' })
        const available = await isUserAvailable(data.email)
        if(!available) return res.status(409).json({ message: 'Usuario existente' })
        const hash = await hashData({
            curp: data.curp,
            pass: data.pass
        })
        if(data.pass === data.passConfirm && !!hash) {
            const registerData = {
                Name: data.name,
                Email: data.email,
                Pass: hash.pass,
                CURP: hash.CURP,
                Birth: data.birth,
                UserType: "student",
                Pays: [],
                kardex: `KARDEX${data.email}`,
                RelatedEmail: null,
                Tabloids: [],
                Badges: []
            };
            const userData = await Student.create(registerData)
            if(userData) {
                await sendConfStudentMail(data.email)
                return res.status(201).json({
                    message: "Usuario creado correctamente", 
                    status: 201
                });
            }
        } else return res.status(400).json({ message: 'Las contraseñas no coinciden' })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { data } = req.body
        const user = await User.findOne({ Email: data.email })
        if (!user) return res.status(404).json({ message: 'Correo no válido' })
        const contrasenaValida = await comparePasswords(data.pass, user.Pass)
        if (!contrasenaValida) return res.status(401).json({ message: 'Error al iniciar sesión' })
        const { Pass, ...userData} = user.toObject()
        res.json({ 
            ...userData,
            Token: genTok(),
            status: 200
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getUser = async (req, res) => {
    try {
        const { email } = req.body
        if(!email)  return res.status(400).json({ message: 'Información no válida' })
        const user = await User.findOne({ Email: email })
        if(!user) return res.status(404).json({ message: 'Usuario no encontrado' })
        let curp = null
        if(user.CURP && user.CURP.iv && user.CURP.content) {
            try {
                curp = decryptCurp(user.CURP)
            } catch (decryptError) {
                console.error('Error desencriptando CURP:', decryptError)
            }
        }
        const { Pass, CURP, ...userData } = user.toObject()
        return res.status(200).json({ 
            ...userData,
            CURP: curp, 
            status: 200
        })
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
}

export const changeData = async (req, res) => {
    try {
        const { data, changes } = req.body
        if (!data || !data.email || !data.pass)
            return res.status(400).json({ message: 'Datos incompletos' })
        const user = await User.findOne({ Email: data.email })
        if (!user) return res.status(404).json({ message: 'Correo no válido' })
        const contrasenaValida = await comparePasswords(data.pass, user.Pass)
        if (!contrasenaValida) return res.status(401).json({ message: 'Error al iniciar sesión' })
        if (changes && changes.data) {
            console.log("Recabando cambios")
            const updateFields = {} 
            if (changes.data.name) updateFields.Name = changes.data.name
            if (changes.data.birth) updateFields.Birth = changes.data.birth
            if (changes.data.phone) updateFields.Phone = changes.data.phone
            if (changes.data.curp) {
                const hashedCurp = await hashData({ curp: changes.data.curp })
                updateFields.CURP = hashedCurp.CURP
            }
            if (changes.data.pass) {
                const hashedPass = await hashData({ pass: changes.data.pass })
                updateFields.Pass = hashedPass.pass
            }
            if (Object.keys(updateFields).length > 0) {
                await User.findByIdAndUpdate(user._id, { $set: updateFields })
            }
            return res.status(200).json({ 
                message: 'Datos actualizados exitosamente',
                updatedFields: Object.keys(updateFields),
                status: 200
            });
        }
        return res.status(200).json({ 
            message: 'No se realizaron cambios',
            updatedFields: [],
            status: 200
        })
    } catch (error) {
        console.error('Error en changeData:', error)
        res.status(500).json({ message: error.message })
    }
}

export const dropUser = async(req, res) =>{
    try {
        const { data } = req.body
        if (!data || !data.email || !data.pass)
            return res.status(400).json({ message: 'Datos incompletos' })
        const user = await User.findOne({ Email: data.email })
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
        const contrasenaValida = await comparePasswords(data.pass, user.Pass)
        if (!contrasenaValida) return res.status(401).json({ message: 'Error al iniciar sesión' })
        await User.findByIdAndDelete(user._id)
        
        return res.status(200).json({ 
            message: 'Cuenta eliminada exitosamente',
            status: 200
        })
    } catch (error) {
        console.error('Error en drop:', error)
        res.status(500).json({ message: error.message })
    }

}
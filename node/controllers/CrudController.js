import User from '../models/user/UserModel.js';
import bcrypt from 'bcrypt';

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

export const create = async (req, res) => {
    try {
        const { data } = req.body
        if(!data) return res.status(400).json({message: "Sin informacion"})
    } catch (error) {
        console.error('Error en drop:', error)
        res.status(500).json({ message: error.message })
    }
}

export const findBy = async (req, res) => {
    try {
        const { data } = req.body;
        if (!data) return res.status(400).json({ message: "Sin información" })
        let query = {}
        if (data.ID) query._id = data.ID
        if (data.Email) query.Email = data.Email
        if (data.Name) query.Name = { $regex: data.Name, $options: 'i' }
        if (Object.keys(query).length === 0) return res.status(400).json({ message: "No se proporcionaron campos de búsqueda válidos" })
        let result
        if (data.ID) result = await User.findById(data.ID)
        else if (data.Name) result = await User.find(query)
        else result = await User.findOne(query)
        try {
            curp = decryptCurp(user.CURP)
        } catch (decryptError) {
            console.error('Error desencriptando CURP:', decryptError)
        }
        const { Pass, CURP, ...userData } = user.toObject()
        if (!result || (Array.isArray(result) && result.length === 0))  
            return res.status(404).json({ message: "No se encontró ningún usuario" })
        res.status(200).json({ data: result, message: "Usuario encontrado", status: 200 })
    } catch (error) {
        console.error('Error en findBy:', error)
        res.status(500).json({ message: error.message })
    }
}

export const getAll = async (req, res) => {
    try {
        const data = await User.find({})
        res.status(200).json({ data: data, status: 200 })
    } catch (error) {
        console.error('Error en drop:', error)
        res.status(500).json({ message: error.message })
    }
}

export const update = async (req, res) => {
    try {
        const { changes } = req.body
        const user = await User.findOne({ Email: changes.email })
        if (!user) return res.status(404).json({ message: 'Correo no válido' })
        if (changes && changes.data) {
            const updateFields = {} 
            if (changes.name) updateFields.Name = changes.name
            if (changes.birth) updateFields.Birth = changes.birth
            if (changes.RFC) updateFields.RFC = changes.RFC
            if (changes.NCount) updateFields.NCount = changes.NCount
            if (changes.Phone) updateFields.Phone = changes.Phone
            if (changes.Cedula) updateFields.Cedula = changes.Cedula
            if (changes.curp) {
                const hashedCurp = await hashData({ curp: changes.phone })
                updateFields.CURP = hashedCurp.CURP
            }
            if (changes.pass) {
                const hashedPass = await hashData({ pass: changes.pass })
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
        console.error('Error en drop:', error)
        res.status(500).json({ message: error.message })
    }
}

export const drop = async (req, res) => {
    try {
        const { id } = req.body
        if(!id) return res.status(400).json({message: "Sin informacion"})
        await User.findByIdAndDelete(id)
        return res.status(200).json({ message: 'Usuario eliminado', status: 200 })
    } catch (error) {
        console.error('Error en drop:', error)
        res.status(500).json({ message: error.message })
    }
}
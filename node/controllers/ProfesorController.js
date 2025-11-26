import Profesor from '../models/user/ProfesorModel.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

export const createProfesor = async (req, res) => {
    try {
        const { data } = req.body
        if(!data) return res.status(400).json({message: "Sin informacion"})
        
        // Validar campos obligatorios
        if(!data.name || !data.email || !data.pass || !data.curp || !data.birth || 
           !data.rfc || !data.nCount || !data.cedula) {
            return res.status(400).json({message: "Faltan campos obligatorios"})
        }
        
        // Verificar si el email ya existe
        const emailAvailable = await isUserAvailable(data.email)
        if(!emailAvailable) return res.status(409).json({message: "El correo ya está registrado"})
        
        // Hashear datos sensibles
        const hashedData = await hashData({ 
            curp: data.curp, 
            pass: data.pass 
        })
        
        if (!hashedData) return res.status(500).json({ message: "Error al procesar datos" })
        
        // Crear objeto del profesor
        const profesorData = {
            Name: data.name,
            Email: data.email,
            Pass: hashedData.pass,
            CURP: hashedData.CURP,
            Birth: data.birth,
            UserType: 'profesor',
            RFC: data.rfc,
            NCount: data.nCount,
            Cedula: data.cedula,
            Tabloid: data.tabloids || [] // Inicializar array de tabloides vacío
        }
        
        const newProfesor = new User(profesorData)
        await newProfesor.save()
        
        res.status(201).json({ 
            message: 'Profesor creado exitosamente', 
            status: 201,
            id: newProfesor._id
        })
        
    } catch (error) {
        console.error('Error en createProfesor:', error)
        res.status(500).json({ message: error.message })
    }
}

export const getAllProfesores = async (req, res) => {
    try {
        // Buscar solo usuarios de tipo profesor
        const profesores = await User.find({ UserType: 'profesor' })
        
        // Procesar para desencriptar CURP y excluir datos sensibles
        const processedProfesores = profesores.map(profesor => {
            const profesorObj = profesor.toObject()
            let decryptedCurp = null
            
            // Desencriptar CURP
            if (profesorObj.CURP && profesorObj.CURP.iv && profesorObj.CURP.content) {
                try {
                    decryptedCurp = decryptCurp(profesorObj.CURP)
                } catch (decryptError) {
                    console.error('Error desencriptando CURP:', decryptError)
                }
            }
            
            // Excluir campos sensibles
            const { Pass, CURP, ...safeData } = profesorObj
            return {
                ...safeData,
                CURP: decryptedCurp
            }
        })
        
        res.status(200).json({ 
            data: processedProfesores, 
            message: "Profesores obtenidos",
            count: processedProfesores.length,
            status: 200 
        })
        
    } catch (error) {
        console.error('Error en getAllProfesores:', error)
        res.status(500).json({ message: error.message })
    }
}

export const updateProfesorTabloids = async (req, res) => {
    try {
        const { profesorId, tabloids } = req.body // tabloids: array de NTabloid
        
        if(!profesorId || !Array.isArray(tabloids)) {
            return res.status(400).json({message: "Datos inválidos"})
        }
        
        // Verificar que el profesor existe
        const profesor = await User.findOne({ _id: profesorId, UserType: 'profesor' })
        if (!profesor) return res.status(404).json({ message: 'Profesor no encontrado' })
        
        // Convertir array de strings a array de objetos {NTabloid: string}
        const tabloidObjects = tabloids.map(ntabloid => ({ NTabloid: ntabloid }))
        
        // Actualizar todos los tabloides
        await User.findByIdAndUpdate(
            profesorId,
            { 
                $set: { 
                    Tabloid: tabloidObjects 
                } 
            }
        )
        
        res.status(200).json({ 
            message: 'Tabloides actualizados exitosamente',
            status: 200,
            tabloidsCount: tabloids.length
        })
        
    } catch (error) {
        console.error('Error en updateProfesorTabloids:', error)
        res.status(500).json({ message: error.message })
    }
}
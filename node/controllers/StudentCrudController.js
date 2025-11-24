import User from '../models/user/UserModel.js'
import Student from '../models/user/StudentModel.js'
import Tutor from '../models/user/TutorModel.js'
import Profesor from '../models/user/ProfesorModel.js'
import Tabloid from '../models/tabloid/TabloidModel.js'
import Notice from '../models/tabloid/NoticeModel.js';
import Assigment from '../models/tabloid/AssigmentModel.js';
import Content from '../models/tabloid/ContentModel.js'

import bcrypt from 'bcrypt'
import crypto from 'crypto'
export const comparePasswords = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
const genTok = () => crypto.randomBytes(32).toString('hex');

//const salt = await bcrypt.genSalt(10); para hasheo
//await bcrypt.hash(dato, salt),

// CREATE - Crear un nuevo estudiante
export const create = async (req, res) => {
    try {
        const { data } = req.body;
        
        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'Sin información en el cuerpo de la petición'
            });
        }

        // Validar campos requeridos
        const requiredFields = ['Name', 'Email', 'Pass', 'CURP', 'Birth', 'kardex'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Faltan campos requeridos: ${missingFields.join(', ')}`
            });
        }

        // Verificar si el usuario ya existe por Email o CURP
        const existingUserByEmail = await User.findOne({ Email: data.Email });
        const existingUserByCurp = await User.findOne({ CURP: data.CURP });
        
        if (existingUserByEmail) {
            return res.status(409).json({
                success: false,
                message: 'Email ya registrado'
            });
        }

        if (existingUserByCurp) {
            return res.status(409).json({
                success: false,
                message: 'CURP ya registrado'
            });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.Pass, salt);

        // Crear el estudiante con los datos estructurados
        const studentData = {
            Name: data.Name,
            Email: data.Email,
            Pass: hashedPassword,
            CURP: data.CURP,
            Birth: data.Birth,
            UserType: 'student',
            kardex: data.kardex,
            RelatedEmail: data.RelatedEmail || '',
            Pays: data.Pays || [],
            Tabloids: data.Tabloids || []
        };

        const newStudent = new Student(studentData);
        const savedStudent = await newStudent.save();

        // No enviar la contraseña en la respuesta
        const studentResponse = savedStudent.toObject();
        delete studentResponse.Pass;

        res.status(201).json({
            success: true,
            message: 'Estudiante creado exitosamente',
            data: studentResponse
        });
        
    } catch (error) {
        console.error('Error al crear estudiante:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear estudiante',
            error: error.message
        });
    }
};

// READ - Obtener todos los estudiantes
export const getAll = async (req, res) => {
    try {
        const students = await Student.find().select('-Pass');
        
        res.status(200).json({
            success: true,
            data: students
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estudiantes',
            error: error.message
        });
    }
};

// READ - Obtener estudiante por ID
export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const student = await Student.findById(id).select('-Pass');
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: student
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estudiante',
            error: error.message
        });
    }
};

// UPDATE - Actualizar estudiante por ID
export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body.data || req.body;

        // Buscar el estudiante primero
        const existingStudent = await Student.findById(id);
        
        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }

        // Si se está actualizando la contraseña, hashearla
        if (updateData.Pass) {
            const salt = await bcrypt.genSalt(10);
            updateData.Pass = await bcrypt.hash(updateData.Pass, salt);
        }

        // No permitir cambiar el tipo de usuario
        if (updateData.UserType && updateData.UserType !== 'student') {
            return res.status(400).json({
                success: false,
                message: 'No se puede cambiar el tipo de usuario'
            });
        }

        // Actualizar el estudiante
        const updatedStudent = await Student.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-Pass');

        res.status(200).json({
            success: true,
            message: 'Estudiante actualizado exitosamente',
            data: updatedStudent
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar estudiante',
            error: error.message
        });
    }
};

// DELETE - Eliminar estudiante por ID
export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        
        const student = await Student.findById(id);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }
        
        await Student.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Estudiante eliminado exitosamente'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar estudiante',
            error: error.message
        });
    }
};

// Búsqueda de estudiante por email
export const getByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        
        const student = await Student.findOne({ Email: email.toLowerCase() }).select('-Pass');
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: student
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar estudiante',
            error: error.message
        });
    }
};

// Búsqueda de estudiante por kardex
export const getByKardex = async (req, res) => {
    try {
        const { kardex } = req.params;
        
        const student = await Student.findOne({ kardex }).select('-Pass');
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: student
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar estudiante por kardex',
            error: error.message
        });
    }
};
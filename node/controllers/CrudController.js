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

// CREATE - Crear un nuevo usuario según su tipo
export const create = async (req, res) => {
    try {
        const { UserType, ...userData } = req.body;
        
        let newUser;
        
        switch (UserType) {
            case 'student':
                newUser = Student.create(userData);
                break;
            case 'profesor':
                newUser = Profesor.create(userData);
                break;
            case 'tutor':
                newUser = Tutor.create(userData);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Tipo de usuario no válido'
                });
        }
        
        const savedUser = await newUser.save();
        
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: savedUser
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
            error: error.message
        });
    }
};

// READ - Obtener todos los usuarios o por tipo
export const getAll = async (req, res) => {
    try {
        const { type } = req.query;
        let users;
        
        if (type) {
            switch (type) {
                case 'student':
                    users = await Student.find();
                    break;
                case 'profesor':
                    users = await Profesor.find();
                    break;
                case 'tutor':
                    users = await Tutor.find();
                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Tipo de usuario no válido'
                    });
            }
        } else {
            users = await User.find();
        }
        
        res.status(200).json({
            success: true,
            data: users
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

// READ - Obtener usuario por ID
export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: user
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
};

// UPDATE - Actualizar usuario por ID
export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Buscar el usuario primero para saber su tipo
        const existingUser = await User.findById(id);
        
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // No permitir cambiar el tipo de usuario
        if (updateData.UserType && updateData.UserType !== existingUser.UserType) {
            return res.status(400).json({
                success: false,
                message: 'No se puede cambiar el tipo de usuario'
            });
        }
        
        // Actualizar según el tipo de usuario
        let updatedUser;
        switch (existingUser.UserType) {
            case 'student':
                updatedUser = await Student.findByIdAndUpdate(
                    id, 
                    updateData, 
                    { new: true, runValidators: true }
                );
                break;
            case 'profesor':
                updatedUser = await Profesor.findByIdAndUpdate(
                    id, 
                    updateData, 
                    { new: true, runValidators: true }
                );
                break;
            case 'tutor':
                updatedUser = await Tutor.findByIdAndUpdate(
                    id, 
                    updateData, 
                    { new: true, runValidators: true }
                );
                break;
        }
        
        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: updatedUser
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

// DELETE - Eliminar usuario por ID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        await User.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
};

// Búsqueda por email
export const getByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        
        const user = await User.findOne({ Email: email.toLowerCase() });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: user
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar usuario',
            error: error.message
        });
    }
};
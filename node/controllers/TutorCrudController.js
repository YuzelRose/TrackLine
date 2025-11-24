import User from '../models/user/UserModel.js';
import Tutor from '../models/user/TutorModel.js';
import bcrypt from 'bcrypt';

// CREATE - Crear un nuevo tutor
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
        const requiredFields = ['Name', 'Email', 'Pass', 'CURP', 'Birth', 'Phone'];
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

        // Crear el tutor con los datos estructurados
        const tutorData = {
            Name: data.Name,
            Email: data.Email,
            Pass: hashedPassword,
            CURP: data.CURP,
            Birth: data.Birth,
            UserType: 'tutor',
            Phone: data.Phone,
            RelatedEmail: data.RelatedEmail || ''
        };

        const newTutor = new Tutor(tutorData);
        const savedTutor = await newTutor.save();

        // No enviar la contraseña en la respuesta
        const tutorResponse = savedTutor.toObject();
        delete tutorResponse.Pass;

        res.status(201).json({
            success: true,
            message: 'Tutor creado exitosamente',
            data: tutorResponse
        });
        
    } catch (error) {
        console.error('Error al crear tutor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear tutor',
            error: error.message
        });
    }
};

// READ - Obtener todos los tutores
export const getAll = async (req, res) => {
    try {
        const tutors = await Tutor.find().select('-Pass');
        
        res.status(200).json({
            success: true,
            data: tutors
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener tutores',
            error: error.message
        });
    }
};

// READ - Obtener tutor por ID
export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const tutor = await Tutor.findById(id).select('-Pass');
        
        if (!tutor) {
            return res.status(404).json({
                success: false,
                message: 'Tutor no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: tutor
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener tutor',
            error: error.message
        });
    }
};

// UPDATE - Actualizar tutor por ID
export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body.data || req.body;

        // Buscar el tutor primero
        const existingTutor = await Tutor.findById(id);
        
        if (!existingTutor) {
            return res.status(404).json({
                success: false,
                message: 'Tutor no encontrado'
            });
        }

        // Si se está actualizando la contraseña, hashearla
        if (updateData.Pass) {
            const salt = await bcrypt.genSalt(10);
            updateData.Pass = await bcrypt.hash(updateData.Pass, salt);
        }

        // No permitir cambiar el tipo de usuario
        if (updateData.UserType && updateData.UserType !== 'tutor') {
            return res.status(400).json({
                success: false,
                message: 'No se puede cambiar el tipo de usuario'
            });
        }

        // Actualizar el tutor
        const updatedTutor = await Tutor.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-Pass');

        res.status(200).json({
            success: true,
            message: 'Tutor actualizado exitosamente',
            data: updatedTutor
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar tutor',
            error: error.message
        });
    }
};

// DELETE - Eliminar tutor por ID
export const deleteTutor = async (req, res) => {
    try {
        const { id } = req.params;
        
        const tutor = await Tutor.findById(id);
        
        if (!tutor) {
            return res.status(404).json({
                success: false,
                message: 'Tutor no encontrado'
            });
        }
        
        await Tutor.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Tutor eliminado exitosamente'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar tutor',
            error: error.message
        });
    }
};

// Búsqueda de tutor por email
export const getByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        
        const tutor = await Tutor.findOne({ Email: email.toLowerCase() }).select('-Pass');
        
        if (!tutor) {
            return res.status(404).json({
                success: false,
                message: 'Tutor no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: tutor
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar tutor',
            error: error.message
        });
    }
};

// Búsqueda de tutor por teléfono
export const getByPhone = async (req, res) => {
    try {
        const { phone } = req.params;
        
        const tutor = await Tutor.findOne({ Phone: phone }).select('-Pass');
        
        if (!tutor) {
            return res.status(404).json({
                success: false,
                message: 'Tutor no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: tutor
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar tutor por teléfono',
            error: error.message
        });
    }
};

// Búsqueda de tutor por email relacionado
export const getByRelatedEmail = async (req, res) => {
    try {
        const { relatedEmail } = req.params;
        
        const tutor = await Tutor.findOne({ RelatedEmail: relatedEmail.toLowerCase() }).select('-Pass');
        
        if (!tutor) {
            return res.status(404).json({
                success: false,
                message: 'Tutor no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: tutor
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar tutor por email relacionado',
            error: error.message
        });
    }
};

// Obtener tutores con email relacionado específico
export const getTutorsByStudentEmail = async (req, res) => {
    try {
        const { studentEmail } = req.params;
        
        const tutors = await Tutor.find({ RelatedEmail: studentEmail.toLowerCase() }).select('-Pass');
        
        res.status(200).json({
            success: true,
            data: tutors
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener tutores por email de estudiante',
            error: error.message
        });
    }
};
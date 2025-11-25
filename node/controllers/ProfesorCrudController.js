import User from '../models/user/UserModel.js';
import Profesor from '../models/user/ProfesorModel.js';
import bcrypt from 'bcrypt';

// CREATE - Crear un nuevo profesor
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
        const requiredFields = ['Name', 'Email', 'Pass', 'CURP', 'Birth', 'RFC', 'NCount', 'Cedula'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Faltan campos requeridos: ${missingFields.join(', ')}`
            });
        }

        // Verificar si el usuario ya existe por Email, CURP o RFC
        const existingUserByEmail = await User.findOne({ Email: data.Email });
        const existingUserByCurp = await User.findOne({ CURP: data.CURP });
        const existingUserByRFC = await Profesor.findOne({ RFC: data.RFC });
        const existingUserByNCount = await Profesor.findOne({ NCount: data.NCount });
        
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

        if (existingUserByRFC) {
            return res.status(409).json({
                success: false,
                message: 'RFC ya registrado'
            });
        }

        if (existingUserByNCount) {
            return res.status(409).json({
                success: false,
                message: 'Número de cuenta ya registrado'
            });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.Pass, salt);

        // Crear el profesor con los datos estructurados
        const profesorData = {
            Name: data.Name,
            Email: data.Email,
            Pass: hashedPassword,
            CURP: data.CURP,
            Birth: data.Birth,
            UserType: 'profesor',
            RFC: data.RFC,
            NCount: data.NCount,
            Cedula: data.Cedula,
            Tabloid: data.Tabloid || []
        };

        const newProfesor = new Profesor(profesorData);
        const savedProfesor = await newProfesor.save();

        // No enviar la contraseña en la respuesta
        const profesorResponse = savedProfesor.toObject();
        delete profesorResponse.Pass;

        res.status(201).json({
            success: true,
            message: 'Profesor creado exitosamente',
            data: profesorResponse
        });
        
    } catch (error) {
        console.error('Error al crear profesor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear profesor',
            error: error.message
        });
    }
};

// READ - Obtener todos los profesores
export const getAll = async (req, res) => {
    try {
        const profesors = await Profesor.find().select('-Pass');
        
        res.status(200).json({
            success: true,
            data: profesors
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener profesores',
            error: error.message
        });
    }
};

// READ - Obtener profesor por ID
export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const profesor = await Profesor.findById(id).select('-Pass');
        
        if (!profesor) {
            return res.status(404).json({
                success: false,
                message: 'Profesor no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: profesor
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener profesor',
            error: error.message
        });
    }
};

// UPDATE - Actualizar profesor por ID
export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body.data || req.body;

        // Buscar el profesor primero
        const existingProfesor = await Profesor.findById(id);
        
        if (!existingProfesor) {
            return res.status(404).json({
                success: false,
                message: 'Profesor no encontrado'
            });
        }

        // Si se está actualizando la contraseña, hashearla
        if (updateData.Pass) {
            const salt = await bcrypt.genSalt(10);
            updateData.Pass = await bcrypt.hash(updateData.Pass, salt);
        }

        // Verificar unicidad de RFC y NCount si se están actualizando
        if (updateData.RFC && updateData.RFC !== existingProfesor.RFC) {
            const existingRFC = await Profesor.findOne({ RFC: updateData.RFC });
            if (existingRFC) {
                return res.status(409).json({
                    success: false,
                    message: 'RFC ya registrado por otro profesor'
                });
            }
        }

        if (updateData.NCount && updateData.NCount !== existingProfesor.NCount) {
            const existingNCount = await Profesor.findOne({ NCount: updateData.NCount });
            if (existingNCount) {
                return res.status(409).json({
                    success: false,
                    message: 'Número de cuenta ya registrado por otro profesor'
                });
            }
        }

        // No permitir cambiar el tipo de usuario
        if (updateData.UserType && updateData.UserType !== 'profesor') {
            return res.status(400).json({
                success: false,
                message: 'No se puede cambiar el tipo de usuario'
            });
        }

        // Actualizar el profesor
        const updatedProfesor = await Profesor.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-Pass');

        res.status(200).json({
            success: true,
            message: 'Profesor actualizado exitosamente',
            data: updatedProfesor
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar profesor',
            error: error.message
        });
    }
};

// DELETE - Eliminar profesor por ID
export const deleteProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        
        const profesor = await Profesor.findById(id);
        
        if (!profesor) {
            return res.status(404).json({
                success: false,
                message: 'Profesor no encontrado'
            });
        }
        
        await Profesor.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Profesor eliminado exitosamente'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar profesor',
            error: error.message
        });
    }
};

// Búsqueda de profesor por email
const searchByEmail = async (req, res) => {
    try{
        const { email } = req.body
        if(!email) return res.status(400).json({message: "correo no valido"})
        const user = await Profesor.findOne({Email: email})
        if(!user) return res.status(404).json({message: "No se encontraron Tutores"})
        res.status(200).json({user, status:200})
    } catch(error){
        console.error(error)
    }
}

// Búsqueda de profesor por RFC
export const getByRFC = async (req, res) => {
    try {
        const { rfc } = req.params;
        
        const profesor = await Profesor.findOne({ RFC: rfc.toUpperCase() }).select('-Pass');
        
        if (!profesor) {
            return res.status(404).json({
                success: false,
                message: 'Profesor no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: profesor
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar profesor por RFC',
            error: error.message
        });
    }
};

// Búsqueda de profesor por número de cuenta
export const getByNCount = async (req, res) => {
    try {
        const { ncount } = req.params;
        
        const profesor = await Profesor.findOne({ NCount: ncount }).select('-Pass');
        
        if (!profesor) {
            return res.status(404).json({
                success: false,
                message: 'Profesor no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: profesor
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar profesor por número de cuenta',
            error: error.message
        });
    }
};

// Agregar tabloide a profesor
export const addTabloid = async (req, res) => {
    try {
        const { id } = req.params;
        const { NTabloid } = req.body;
        
        if (!NTabloid) {
            return res.status(400).json({
                success: false,
                message: 'El campo NTabloid es requerido'
            });
        }

        const profesor = await Profesor.findById(id);
        
        if (!profesor) {
            return res.status(404).json({
                success: false,
                message: 'Profesor no encontrado'
            });
        }

        // Verificar si el tabloide ya existe
        const existingTabloid = profesor.Tabloid.find(t => t.NTabloid === NTabloid);
        if (existingTabloid) {
            return res.status(409).json({
                success: false,
                message: 'El tabloide ya está asignado a este profesor'
            });
        }

        // Agregar el nuevo tabloide
        profesor.Tabloid.push({ NTabloid });
        await profesor.save();

        res.status(200).json({
            success: true,
            message: 'Tabloide agregado exitosamente',
            data: profesor
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al agregar tabloide',
            error: error.message
        });
    }
};

// Remover tabloide de profesor
export const removeTabloid = async (req, res) => {
    try {
        const { id, ntabloid } = req.params;
        
        const profesor = await Profesor.findById(id);
        
        if (!profesor) {
            return res.status(404).json({
                success: false,
                message: 'Profesor no encontrado'
            });
        }

        // Filtrar el tabloide a remover
        profesor.Tabloid = profesor.Tabloid.filter(t => t.NTabloid !== ntabloid);
        await profesor.save();

        res.status(200).json({
            success: true,
            message: 'Tabloide removido exitosamente',
            data: profesor
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al remover tabloide',
            error: error.message
        });
    }
};
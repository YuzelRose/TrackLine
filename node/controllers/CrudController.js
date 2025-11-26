import User from '../models/user/UserModel.js'
import Tabloid from '../models/tabloid/TabloidModel.js'
import mongoose from 'mongoose';
import Notice from '../models/tabloid/NoticeModel.js';
import Assigment from '../models/tabloid/AssigmentModel.js';
import Content from '../models/tabloid/ContentModel.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const isUserAvailable = async (email) => {
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
            result.pass = hashPass
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
            const authTag = cipher.getAuthTag()
            
            result.CURP = {
                iv: iv.toString('hex'),        
                content: encrypted,
                authTag: authTag.toString('hex')
            }
        }
        return result
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
        return decrypted
    } catch(error) {
        console.error('Error al desencriptar CURP:', error)
        return null
    }
}

export const create = async (req, res) => {
    try {
        const { data } = req.body
        if(!data) return res.status(400).json({message: "Sin informacion"})
        if(!(await isUserAvailable(data.email))) return res.status(409).json({message: "Usuario ya registrado"})
        
        const hashedData = await hashData({ 
            curp: data.curp, 
            pass: data.pass 
        })
        
        if (!hashedData) return res.status(500).json({ message: "Error al procesar datos" })
        
        const userData = {
            Name: data.name,
            Email: data.email,
            Pass: hashedData.pass,
            CURP: hashedData.CURP,
            Birth: data.birth,
            UserType: data.userType
        }
        
        if (data.userType === 'tutor') {
            userData.Phone = data.phone
            userData.RelatedEmail = data.relatedEmail
        } else if (data.userType === 'student') {
            userData.kardex = data.kardex
            userData.RelatedEmail = data.relatedEmail
        } else if (data.userType === 'profesor') {
            userData.RFC = data.rfc
            userData.NCount = data.nCount
            userData.Cedula = data.cedula
        }
        
        const newUser = new User(userData)
        await newUser.save()
        
        res.status(201).json({ 
            message: 'Usuario creado exitosamente', 
            status: 201 
        })
        
    } catch (error) {
        console.error('Error en create:', error)
        res.status(500).json({ message: error.message })
    }
}

export const findBy = async (req, res) => {
    try {
        const { data } = req.body
        if (!data) return res.status(400).json({ message: "Sin información" })
        
        let query = {}
        if (data.ID) query._id = data.ID
        if (data.Email) query.Email = data.Email
        if (data.Name) query.Name = { $regex: data.Name, $options: 'i' }
        if (data.Type) query.Type = data.Type
        
        if (Object.keys(query).length === 0) 
            return res.status(400).json({ message: "No se proporcionaron campos de búsqueda válidos" })
        
        let result
        if (data.ID) result = await User.findById(data.ID)
        else if (data.Name) result = await User.find(query)
        else result = await User.findOne(query)
        
        if (!result || (Array.isArray(result) && result.length === 0))  
            return res.status(404).json({ message: "No se encontró ningún usuario" })
        
        const processUser = (user) => {
            const userObj = user.toObject()
            let decryptedCurp = null
            
            if (userObj.CURP && userObj.CURP.iv && userObj.CURP.content) {
                try {
                    decryptedCurp = decryptCurp(userObj.CURP)
                } catch (decryptError) {
                    console.error('Error desencriptando CURP:', decryptError)
                }
            }

            const { Pass, CURP, ...safeData } = userObj
            return {
                ...safeData,
                CURP: decryptedCurp 
            }
        }
        
        const processedResult = Array.isArray(result) 
            ? result.map(processUser) 
            : processUser(result)
        
        res.status(200).json({ 
            data: processedResult, 
            message: "Usuario encontrado", 
            status: 200 
        })
        
    } catch (error) {
        console.error('Error en findBy:', error)
        res.status(500).json({ message: error.message })
    }
}

export const getAll = async (req, res) => {
    try {
        const { type } = req.query
        let query = {}
        if (type && type !== 'all') {
            query.Type = type
        }
        const data = await User.find(query)
        const processedData = data.map(user => {
            const userObj = user.toObject()
            let decryptedCurp = null
            
            if (userObj.CURP && userObj.CURP.iv && userObj.CURP.content) {
                try {
                    decryptedCurp = decryptCurp(userObj.CURP)
                } catch (decryptError) {
                    console.error('Error desencriptando CURP:', decryptError)
                }
            }
            const { Pass, CURP, ...safeData } = userObj
            return {
                ...safeData,
                CURP: decryptedCurp
            }
        })
        res.status(200).json({ 
            data: processedData, 
            message: type ? `Usuarios de tipo ${type} obtenidos` : "Todos los usuarios obtenidos",
            count: processedData.length,
            type: type || 'all',
            status: 200 
        })
    } catch (error) {
        console.error('Error en getAll:', error)
        res.status(500).json({ message: error.message })
    }
}

export const update = async (req, res) => {
    try {
        const { data, changes } = req.body 
        if (!data || !data.email) 
            return res.status(400).json({ message: "Correo requerido" })
            
        const user = await User.findOne({ Email: data.email })
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
        
        if (changes && changes.data) {
            const updateFields = {}
            
            if (changes.data.name) updateFields.Name = changes.data.name
            if (changes.data.birth) updateFields.Birth = changes.data.birth
            
            if (user.UserType === 'profesor') {
                if (changes.data.RFC) updateFields.RFC = changes.data.RFC
                if (changes.data.NCount) updateFields.NCount = changes.data.NCount
                if (changes.data.Cedula) updateFields.Cedula = changes.data.Cedula
            }
            
            if (user.UserType === 'tutor') {
                if (changes.data.Phone) updateFields.Phone = changes.data.Phone
                if (changes.data.RelatedEmail) updateFields.RelatedEmail = changes.data.RelatedEmail
            }
            
            if (changes.data.curp) {
                const hashedCurp = await hashData({ curp: changes.data.curp }) 
                if (hashedCurp && hashedCurp.CURP) {
                    updateFields.CURP = hashedCurp.CURP
                }
            }
            
            if (changes.data.pass) {
                const hashedPass = await hashData({ pass: changes.data.pass })
                if (hashedPass && hashedPass.pass) {
                    updateFields.Pass = hashedPass.pass
                }
            }
            
            if (Object.keys(updateFields).length > 0) {
                await User.findByIdAndUpdate(user._id, { $set: updateFields })
                
                return res.status(200).json({ 
                    message: 'Datos actualizados exitosamente',
                    updatedFields: Object.keys(updateFields),
                    status: 200
                })
            }
        }
        
        return res.status(200).json({ 
            message: 'No se realizaron cambios',
            updatedFields: [],
            status: 200
        })
        
    } catch (error) {
        console.error('Error en update:', error)
        res.status(500).json({ message: error.message })
    }
}

export const drop = async (req, res) => {
    try {
        const { id } = req.body
        if(!id) return res.status(400).json({message: "ID requerido"})
        
        const result = await User.findByIdAndDelete(id)
        if (!result) return res.status(404).json({ message: "Usuario no encontrado" })
        
        return res.status(200).json({ 
            message: 'Usuario eliminado', 
            status: 200 
        })
        
    } catch (error) {
        console.error('Error en drop:', error)
        res.status(500).json({ message: error.message })
    }
}

//tabloid

// Crear tabloide - VERSIÓN CORREGIDA
export const createTabloid = async (req, res) => {
    try {
        const { data } = req.body;
        if (!data) return res.status(400).json({ message: "Sin información", success: false });

        console.log('📝 Datos recibidos para crear tabloide:', data);

        // Validar campos requeridos
        if (!data.Name || !data.Owner || !data.description) {
            return res.status(400).json({ 
                message: "Nombre, propietario y descripción son requeridos", 
                success: false 
            });
        }

        // Verificar que el profesor exista
        const professor = await mongoose.model('User').findById(data.Owner);
        if (!professor) {
            return res.status(404).json({ 
                message: "Profesor no encontrado", 
                success: false 
            });
        }

        if (professor.UserType !== 'profesor') {
            return res.status(400).json({ 
                message: "El propietario debe ser un profesor", 
                success: false 
            });
        }

        console.log('✅ Profesor válido encontrado:', professor._id);

        // Verificar si ya existe un tabloide con ese nombre
        const existingTabloid = await Tabloid.findOne({ Name: data.Name });
        if (existingTabloid) {
            return res.status(409).json({ 
                message: "Ya existe un tabloide con ese nombre", 
                success: false 
            });
        }

        console.log('✅ Nombre de tabloide disponible');

        // Crear y guardar el tabloide
        const newTabloid = new Tabloid({
            Name: data.Name,
            Owner: data.Owner,
            description: data.description,
            HomeWork: [],
            requiredPayment: []
        });

        await newTabloid.save();
        console.log('✅ Tabloide guardado en base de datos:', newTabloid._id);

        // ACTUALIZAR EL PROFESOR - AGREGAR EL TABLOIDE A SU LISTA CON refId
        if (!professor.Tabloids) {
            professor.Tabloids = [];
        }
        
        // Agregar el nuevo tabloide como objeto con refId
        professor.Tabloids.push({
            refId: newTabloid._id
        });
        
        // Guardar el profesor actualizado
        await professor.save();
        console.log('✅ Profesor actualizado con el nuevo tabloide');

        // Respuesta simplificada sin populate
        res.status(201).json({ 
            message: 'Tabloide creado exitosamente', 
            data: {
                _id: newTabloid._id,
                Name: newTabloid.Name,
                Owner: data.Owner,
                description: newTabloid.description,
                homeworkCount: 0,
                paymentCount: 0
            },
            success: true,
            status: 201 
        });
        
    } catch (error) {
        console.error('❌ Error en createTabloid:', error);
        res.status(500).json({ 
            message: error.message, 
            success: false 
        });
    }
}

// Buscar tabloide
export const findByTabloid = async (req, res) => {
    try {
        const { data } = req.body;
        if (!data) return res.status(400).json({ message: "Sin información", success: false });
        
        let query = {};
        if (data.ID) query._id = data.ID;
        if (data.Name) query.Name = { $regex: data.Name, $options: 'i' };
        if (data.Owner) query.Owner = data.Owner;
        
        if (Object.keys(query).length === 0) {
            return res.status(400).json({ 
                message: "No se proporcionaron campos de búsqueda válidos", 
                success: false 
            });
        }
        
        let result;
        if (data.ID) {
            result = await Tabloid.findById(data.ID)
                .populate('Owner', 'Name Email RFC');
        } else if (data.Name) {
            result = await Tabloid.find(query)
                .populate('Owner', 'Name Email RFC');
        } else {
            result = await Tabloid.findOne(query)
                .populate('Owner', 'Name Email RFC');
        }
        
        if (!result || (Array.isArray(result) && result.length === 0)) {
            return res.status(404).json({ 
                message: "No se encontró ningún tabloide", 
                success: false 
            });
        }
        
        // Procesar resultado para incluir conteos
        const processResult = (tabloid) => {
            const tabloidObj = tabloid.toObject ? tabloid.toObject() : tabloid;
            return {
                ...tabloidObj,
                homeworkCount: tabloidObj.HomeWork?.length || 0,
                paymentCount: tabloidObj.requiredPayment?.length || 0
            };
        };
        
        const processedResult = Array.isArray(result) 
            ? result.map(processResult) 
            : processResult(result);
        
        res.status(200).json({ 
            data: processedResult, 
            message: "Tabloide encontrado", 
            success: true,
            status: 200 
        });
        
    } catch (error) {
        console.error('Error en findByTabloid:', error);
        res.status(500).json({ 
            message: error.message, 
            success: false 
        });
    }
}


// Obtener todos los tabloides (versión simplificada sin populate de modelos relacionados)
export const getAllTabloids = async (req, res) => {
    try {
        const { owner, search } = req.body || {};
        let query = {};
        
        if (owner) query.Owner = owner;
        if (search) query.Name = { $regex: search, $options: 'i' };
        
        console.log('🔍 Buscando tabloides con query:', query);
        
        // Obtener tabloides sin populate
        const data = await Tabloid.find(query);
        console.log('📊 Tabloides encontrados:', data.length);
        
        // Extraer IDs de profesores de forma segura
        const professorIds = [];
        
        data.forEach(tabloid => {
            // Verificar que Owner existe y es válido
            if (tabloid.Owner && tabloid.Owner._id) {
                professorIds.push(tabloid.Owner._id.toString());
            } else if (tabloid.Owner) {
                // Si Owner es solo un ID (ObjectId)
                professorIds.push(tabloid.Owner.toString());
            }
        });
        
        console.log('👨‍🏫 IDs de profesores encontrados:', professorIds);
        
        let professors = [];
        let professorMap = {};
        
        // Solo buscar profesores si hay IDs válidos
        if (professorIds.length > 0) {
            // Eliminar duplicados
            const uniqueProfessorIds = [...new Set(professorIds)];
            console.log('👨‍🏫 IDs únicos de profesores:', uniqueProfessorIds);
            
            professors = await mongoose.model('User').find({ 
                _id: { $in: uniqueProfessorIds } 
            }).select('Name Email RFC');
            
            console.log('👨‍🏫 Profesores encontrados en DB:', professors.length);
            
            // Crear mapa de profesores
            professors.forEach(prof => {
                professorMap[prof._id.toString()] = prof;
            });
        }
        
        // Procesar datos de forma completamente segura
        const processedData = data.map(tabloid => {
            let professor = null;
            let ownerId = null;
            
            // Manejar Owner de forma ultra segura
            if (tabloid.Owner) {
                if (tabloid.Owner._id) {
                    // Si Owner está poblado
                    ownerId = tabloid.Owner._id.toString();
                } else {
                    // Si Owner es solo un ObjectId
                    ownerId = tabloid.Owner.toString();
                }
                
                professor = professorMap[ownerId];
            }
            
            return {
                _id: tabloid._id,
                Name: tabloid.Name,
                description: tabloid.description,
                homeworkCount: tabloid.HomeWork?.length || 0,
                paymentCount: tabloid.requiredPayment?.length || 0,
                Owner: professor ? {
                    _id: professor._id,
                    Name: professor.Name,
                    Email: professor.Email,
                    RFC: professor.RFC
                } : {
                    _id: ownerId || 'N/A',
                    Name: 'Profesor no encontrado',
                    Email: 'N/A',
                    RFC: 'N/A'
                }
            };
        });
        
        console.log('✅ Procesamiento completado');
        
        res.status(200).json({ 
            data: processedData, 
            message: "Taboides obtenidos exitosamente",
            count: data.length,
            success: true,
            status: 200 
        });
    } catch (error) {
        console.error('❌ Error en getAllTabloids:', error);
        res.status(500).json({ 
            message: error.message, 
            success: false 
        });
    }
}

// Actualizar tabloide
export const updateTabloid = async (req, res) => {
    try {
        const { data, changes } = req.body;
        if (!data || !data.ID) {
            return res.status(400).json({ 
                message: "ID del tabloide requerido", 
                success: false 
            });
        }
            
        const tabloid = await Tabloid.findById(data.ID);
        if (!tabloid) {
            return res.status(404).json({ 
                message: 'Tabloide no encontrado', 
                success: false 
            });
        }
        
        if (changes && changes.data) {
            const updateFields = {};
            
            if (changes.data.Name) updateFields.Name = changes.data.Name;
            if (changes.data.description) updateFields.description = changes.data.description;
            if (changes.data.Owner) {
                // Verificar que el nuevo propietario sea un profesor
                const professor = await User.findById(changes.data.Owner);
                if (!professor || professor.UserType !== 'profesor') {
                    return res.status(400).json({ 
                        message: "El propietario debe ser un profesor", 
                        success: false 
                    });
                }
                updateFields.Owner = changes.data.Owner;
            }
            
            if (Object.keys(updateFields).length > 0) {
                await Tabloid.findByIdAndUpdate(data.ID, { $set: updateFields });
                
                const updatedTabloid = await Tabloid.findById(data.ID)
                    .populate('Owner', 'Name Email RFC');
                
                return res.status(200).json({ 
                    message: 'Tabloide actualizado exitosamente',
                    data: updatedTabloid,
                    updatedFields: Object.keys(updateFields),
                    success: true,
                    status: 200
                });
            }
        }
        
        return res.status(200).json({ 
            message: 'No se realizaron cambios',
            updatedFields: [],
            success: true,
            status: 200
        });
        
    } catch (error) {
        console.error('Error en updateTabloid:', error);
        res.status(500).json({ 
            message: error.message, 
            success: false 
        });
    }
}

// Eliminar tabloide
export const dropTabloid = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ 
                message: "ID requerido", 
                success: false 
            });
        }
        
        const result = await Tabloid.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ 
                message: "Tabloide no encontrado", 
                success: false 
            });
        }
        
        return res.status(200).json({ 
            message: 'Tabloide eliminado exitosamente', 
            success: true,
            status: 200 
        });
        
    } catch (error) {
        console.error('Error en dropTabloid:', error);
        res.status(500).json({ 
            message: error.message, 
            success: false 
        });
    }
}

// Obtener lista de profesore
export const getProfessors = async (req, res) => {
    try {
        const professors = await mongoose.model('User').find({ UserType: 'profesor' })
            .select('Name Email RFC');
        
        res.status(200).json({ 
            data: professors, 
            message: "Profesores obtenidos exitosamente",
            count: professors.length,
            success: true,
            status: 200 
        });
    } catch (error) {
        console.error('Error en getProfessors:', error);
        res.status(500).json({ 
            message: error.message, 
            success: false 
        });
    }
}
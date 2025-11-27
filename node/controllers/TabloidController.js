import User from '../models/user/UserModel.js'
import Student from '../models/user/StudentModel.js'
import Tabloid from '../models/tabloid/TabloidModel.js'
import Notice from '../models/tabloid/NoticeModel.js';
import Assigment from '../models/tabloid/AssigmentModel.js';
import Content from '../models/tabloid/ContentModel.js'
import mongoose from 'mongoose';
import { hwConf } from '../utils/email.js';

const getUserCourses = async (email) => {
    try {
        const user = await User.findOne({ Email: email })
            .populate({
                path: 'Tabloids.refId',
                populate: [
                    {
                        path: 'HomeWork.notice',
                        model: 'Notice'
                    },
                    {
                        path: 'HomeWork.assigment',
                        model: 'Assigment'
                    }
                ]
            }); 
        if (user && user.Tabloids) {
            return user.Tabloids;
        }
        return null;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return null;
    }
};

export const getCourses = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) 
            return res.status(400).json({ message: 'Email es requerido', status: 400 });
        const courses = await getUserCourses(email);
        if (!courses) 
            return res.status(404).json({ message: 'Usuario no encontrado', status: 404 });
        const validCourses = courses.filter(course => 
            course && course.refId
        );
        if (validCourses.length > 0) {
            return res.status(200).json({ 
                validCourses, 
                status: 200 
            });
        } else {
            return res.status(204).json({ 
                courses: [],
                status: 204
            });
        }
    } catch (error) {
        console.error(`Error al recuperar cursos: ${error.message}`);
        return res.status(500).json({ 
            success: false,
            message: 'Error interno del servidor',
            status: 500 
        });
    }
};

export const addCoursesToUser = async (req, res) => {
    try {
        const { data } = req.body;
        
        if (!data?.course || !data?.email) {
            return res.status(400).json({ message: "Datos incompletos" });
        }

        // Ejecutar ambas consultas en paralelo
        const [tabloid, requestingUser] = await Promise.all([
            Tabloid.findById(data.course).select('_id Name'),
            User.findOne({ Email: data.email })
        ]);

        if (!tabloid) return res.status(404).json({ message: "Curso no encontrado" });
        if (!requestingUser) return res.status(404).json({ message: "Usuario no encontrado" });

        // Determinar el estudiante objetivo
        const studentEmail = requestingUser.UserType === "student" 
            ? data.email 
            : requestingUser.RelatedEmail;

        if (!studentEmail) {
            return res.status(400).json({ message: "No se puede determinar el estudiante objetivo" });
        }

        // Agregar curso al estudiante
        const result = await Student.updateOne(
            { Email: studentEmail },
            { $addToSet: { Tabloids: { refId: tabloid._id } } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        const response = result.modifiedCount === 0
            ? { status: 200, message: `Ya está registrado en "${tabloid.Name}"` }
            : { status: 201, message: `"${tabloid.Name}" agregado correctamente` };

        res.status(response.status).json(response);

    } catch (error) {
        console.error(`Error al agregar curso: ${error.message}`);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const getData = async (req, res) => {
    try {
        const { urlId } = req.body;
        if(!urlId)
            return res.status(400).json({ message: `Informacion: ${urlId}` })
        const consultData = await Tabloid.findById(urlId).populate([
            {
                path: 'HomeWork.notice',
                model: 'Notice'
            },
            {
                path: 'HomeWork.assigment', 
                model: 'Assigment'
            }
        ]);
        if(!consultData)
            return res.status(404).json({ message: `Curso: ${urlId} no encontrado` })
        res.status(200).json({ ...consultData.toObject(), status: 200})
    } catch (error) {
        console.error(`Error al cargar el cursos ${error.message}`)
        res.status(500).json({ message: error.message, place: "Try-catch" })
    }
}

export const getHw = async (req, res) => {
    try {
        const { data } = req.body
        if (!data) 
            return res.status(400).json({ message: `Informacion: ${data}` })
        const user = await Student.findOne({ Email: data.email })
        if (!user) 
            return res.status(404).json({ message: `Usuario: ${data.email} no encontrado` })
        const consultData = await Assigment.findById(data.urlId).populate([
            {
                path: 'Content.file',
                model: 'Content'
            },
            {
                path: 'Submissions.SubmittedWork.file', 
                model: 'Content'
            }
        ]);
        if (!consultData) 
            return res.status(404).json({ message: "Tarea no encontrada", status: 404 });
        const filteredSubmissions = consultData.Submissions.filter(
            submission => submission.Student.toString() === user._id.toString()
        );
        const result = {
            ...consultData.toObject(),
            Submissions: filteredSubmissions,
            status: "200"
        };
        res.status(200).json(result)
    } catch (error) { 
        console.error(`Error al cargar la tarea: ${error.message}`)
        res.status(500).json({ message: error.message, place: "Try-catch" })
    }
}

export const sendHw = async (req, res) => {
    try {
        const { hwID, StudentID } = req.body
        const workFiles = req.files
        
        if (!hwID || !StudentID) 
            return res.status(400).json({ message: "Faltan datos requeridos" })
        if (!workFiles || workFiles.length === 0)  
            return res.status(400).json({ message: "No se enviaron archivos" })
        
        const consultData = await Assigment.findById(hwID)
        if (!consultData) 
            return res.status(404).json({ message: "Tarea no encontrada" })
        
        // BUSCAR O CREAR LA SUBMISSION DEL ESTUDIANTE
        let studentSubmission = consultData.Submissions.find(
            submission => submission.Student.toString() === StudentID
        )
        
        // SI NO EXISTE, CREAR UNA NUEVA SUBMISSION
        if (!studentSubmission) {
            studentSubmission = {
                Student: StudentID,
                Status: "No entregado",
                SubmittedWork: [],
                Grade: 0,
                Feedback: "",
                SubmittedAt: null,
                GradedAt: null
            }
            consultData.Submissions.push(studentSubmission)
            // Obtener la referencia a la submission recién creada
            studentSubmission = consultData.Submissions[consultData.Submissions.length - 1]
        }

        const submittedWorkIds = []
        let ind = 0
        
        for (const file of workFiles) {
            const originalName = file.originalname;
            const lastDotIndex = originalName.lastIndexOf('.');
            const fileExtension = lastDotIndex !== -1 ? originalName.substring(lastDotIndex + 1) : '';
            const newFileName = `file${StudentID}ind${ind}.${fileExtension}`;

            const contentData = await Content.create({
                Name: newFileName,     
                size: file.size,             
                data: file.buffer,           
                contentType: file.mimetype,  
                uploadDate: new Date()
            });

            submittedWorkIds.push({ file: contentData._id })
            ind++
        }
        
        // ACTUALIZAR LA SUBMISSION
        studentSubmission.SubmittedWork = submittedWorkIds
        const currentDate = new Date()
        const dueDate = new Date(consultData.DueDate)
        studentSubmission.Status = currentDate <= dueDate ? "Entregado" : "Tarde"
        studentSubmission.SubmittedAt = currentDate
        
        await consultData.save()
        
        const student = await Student.findById(StudentID);
        if (student && !student.Badges.some(badge => badge.refId === 'fun-Badg1')) {
            student.Badges.push({ refId: 'fun-Badg1' });
            await student.save();
        }
        
        if(student.RelatedEmail){
            hwConf({
                data: {
                    _id: hwID,
                    mail: student.RelatedEmail
                }
            })
        }
        
        res.status(200).json({ 
            message: "Tarea enviada correctamente",
            filesReceived: workFiles.length,
            status: 200,
        });
    } catch (error) {
        console.error(`Error al subir la tarea: ${error.message}`)
        res.status(500).json({ message: error.message, place: "Try-catch" })
    }
}

export const getAll = async (req, res) => {
    try {
        const data = await Tabloid.find({})
        if (!data || data.length === 0) {
            return res.status(404).json({ 
                message: "No se encontraron tabloides",
                status: 404 
            })
        }
        res.status(200).json({ 
            data, 
            message: "Tabloides recuperados exitosamente", 
            status: 200,
        })
    } catch (error) {
        console.error(`Error al obtener tabloides: ${error.message}`)
        res.status(500).json({ 
            message: "Error interno del servidor", 
            error: error.message 
        })
    }
}

export const addPay = async (req, res) => {
    try {
        const { data } = req.body;
        
        if (!data?.course || !data?.email) {
            return res.status(400).json({ message: "Datos incompletos" });
        }

        const [tabloid, requestingUser] = await Promise.all([
            Tabloid.findById(data.course).select('_id Name requiredPayment'),
            User.findOne({ Email: data.email })
        ]);

        if (!tabloid) return res.status(404).json({ message: "Curso no encontrado" });
        if (!requestingUser) return res.status(404).json({ message: "Usuario no encontrado" });

        const studentEmail = requestingUser.UserType === "student" 
            ? data.email 
            : requestingUser.RelatedEmail;

        if (!studentEmail) {
            return res.status(400).json({ message: "No se puede determinar el estudiante objetivo" });
        }

        // Verificar que el tabloide tenga pagos
        if (!tabloid.requiredPayment || tabloid.requiredPayment.length === 0) {
            return res.status(400).json({ 
                message: `El curso "${tabloid.Name}" no tiene pagos requeridos` 
            });
        }

        // Tomar solo el PRIMER pago del array
        const firstPaymentId = tabloid.requiredPayment[0];

        // Agregar solo el primer pago al estudiante
        const result = await Student.updateOne(
            { Email: studentEmail },
            { 
                $addToSet: { 
                    payments: { 
                        payRef: firstPaymentId,
                        status: 'pending'
                    } 
                } 
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        const response = result.modifiedCount === 0
            ? { status: 200, message: `Ya tiene el pago para "${tabloid.Name}"` }
            : { status: 201, message: `Pago agregado correctamente para "${tabloid.Name}"` };

        res.status(response.status).json(response);

    } catch (error) {
        console.error(`Error al agregar pago: ${error.message}`);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

// Controlador para crear notice con texto simple
export const createTextNotice = async (req, res) => {
    try {
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({ message: "Faltan datos requeridos" });
        }

        const { Name, textContent, tabloidId } = data;

        if (!Name || !textContent || !tabloidId) {
            return res.status(400).json({ 
                message: "Faltan campos requeridos: Name, textContent, tabloidId" 
            });
        }

        // Verificar si ya existe un notice con ese nombre
        const existingNotice = await Notice.findOne({ Name });
        if (existingNotice) {
            return res.status(409).json({ 
                message: "Ya existe un notice con este nombre" 
            });
        }

        // Verificar si el tabloid existe
        const tabloid = await Tabloid.findById(tabloidId);
        if (!tabloid) {
            return res.status(404).json({ 
                message: "Tabloid no encontrado" 
            });
        }

        const noticeData = {
            Name: Name.trim(),
            Content: {
                contentType: 'text',
                value: textContent,
                filename: ''
            },
            CreatedAt: new Date()
        };

        const newNotice = await Notice.create(noticeData);

        // Añadir el notice al array HomeWork del tabloid
        tabloid.HomeWork.push({ notice: newNotice._id });
        await tabloid.save();

        res.status(201).json({
            message: "Notice de texto creado exitosamente",
            status: 201,
            data: {
                _id: newNotice._id,
                Name: newNotice.Name,
                Content: newNotice.Content,
                CreatedAt: newNotice.CreatedAt,
                tabloidId: tabloidId
            }
        });

    } catch (error) {
        console.error(`Error al crear notice de texto: ${error.message}`);
        
        if (error.code === 11000) {
            return res.status(409).json({ 
                message: "Ya existe un notice con este nombre" 
            });
        }

        res.status(500).json({ 
            message: error.message, 
            place: "createTextNotice controller" 
        });
    }
};

// Controlador para eliminar notice
export const deleteNotice = async (req, res) => {
    try {
        const { id, tabloidId } = req.body;

        if (!id || !tabloidId) {
            return res.status(400).json({ 
                message: "ID de notice y tabloid requeridos" 
            });
        }

        // Verificar si el tabloid existe
        const tabloid = await Tabloid.findById(tabloidId);
        if (!tabloid) {
            return res.status(404).json({ 
                message: "Tabloid no encontrado" 
            });
        }

        // Eliminar el notice del array HomeWork del tabloid
        tabloid.HomeWork = tabloid.HomeWork.filter(item => 
            !(item.notice && item.notice.toString() === id)
        );
        await tabloid.save();

        // Eliminar el notice de la colección
        const notice = await Notice.findByIdAndDelete(id);
        if (!notice) {
            return res.status(404).json({ 
                message: "Notice no encontrado" 
            });
        }

        res.status(200).json({
            message: "Notice eliminado exitosamente",
            status: 200,
            data: {
                _id: notice._id,
                Name: notice.Name,
                tabloidId: tabloidId
            }
        });

    } catch (error) {
        console.error(`Error al eliminar notice: ${error.message}`);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                message: "ID de notice no válido" 
            });
        }

        res.status(500).json({ 
            message: error.message, 
            place: "deleteNotice controller" 
        });
    }
};

export const createAssigment = async (req, res) => {
    try {
         // Obtener datos de req.body directamente en lugar de req.body.data
        const { Name, Text, DueDate, tabloidId } = req.body;
        const files = req.files;

        // Validar campos obligatorios
        if (!Name || !Text || !DueDate || !tabloidId) {
            return res.status(400).json({ 
                message: "Faltan campos requeridos: Name, Text, DueDate, tabloidId" 
            });
        }

        // El resto del código permanece igual...
        // Verificar si ya existe un assignment con ese nombre
        const existingAssigment = await Assigment.findOne({ Name });
        if (existingAssigment) {
            return res.status(409).json({ 
                message: "Ya existe un assignment con este nombre" 
            });
        }

        // Verificar si el tabloid existe
        const tabloid = await Tabloid.findById(tabloidId);
        if (!tabloid) {
            return res.status(404).json({ 
                message: "Tabloid no encontrado" 
            });
        }

        // Procesar archivos de contenido
        const contentIds = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const originalName = file.originalname;
                const lastDotIndex = originalName.lastIndexOf('.');
                const fileExtension = lastDotIndex !== -1 ? 
                    originalName.substring(lastDotIndex + 1) : '';
                const newFileName = `assignment_${Name}_${Date.now()}_${contentIds.length}.${fileExtension}`;

                const contentDoc = await Content.create({
                    Name: newFileName,
                    size: file.size,
                    data: file.buffer,
                    contentType: file.mimetype,
                    uploadDate: new Date()
                });

                contentIds.push({ file: contentDoc._id });
            }
        }

        // Crear el assignment
        const assignmentData = {
            Name: Name.trim(),
            Text: Text.trim(),
            DueDate: new Date(DueDate),
            Content: contentIds,
            CreatedAt: new Date(),
            Submissions: []
        };

        const newAssignment = await Assigment.create(assignmentData);

        // Añadir el assignment al array HomeWork del tabloid
        tabloid.HomeWork.push({ assigment: newAssignment._id });
        await tabloid.save();

        res.status(201).json({
            message: "Assignment creado exitosamente",
            status: 201,
            data: {
                _id: newAssignment._id,
                Name: newAssignment.Name,
                Text: newAssignment.Text,
                DueDate: newAssignment.DueDate,
                ContentCount: newAssignment.Content.length,
                SubmissionsCount: newAssignment.Submissions.length,
                tabloidId: tabloidId
            }
        });

    } catch (error) {
        console.error(`Error al crear assignment: ${error.message}`);
        
        if (error.code === 11000) {
            return res.status(409).json({ 
                message: "Ya existe un assignment con este nombre" 
            });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: "Error de validación", 
                errors 
            });
        }

        res.status(500).json({ 
            message: error.message, 
            place: "createAssigment controller" 
        });
    }
};

export const createTextAssigment = async (req, res) => {
    try {
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({ message: "Faltan datos requeridos" });
        }

        const { Name, Text, DueDate, tabloidId } = data;

        if (!Name || !Text || !DueDate || !tabloidId) {
            return res.status(400).json({ 
                message: "Faltan campos requeridos: Name, Text, DueDate, tabloidId" 
            });
        }

        // Verificar si ya existe un assignment con ese nombre
        const existingAssigment = await Assigment.findOne({ Name });
        if (existingAssigment) {
            return res.status(409).json({ 
                message: "Ya existe un assignment con este nombre" 
            });
        }

        // Verificar si el tabloid existe
        const tabloid = await Tabloid.findById(tabloidId);
        if (!tabloid) {
            return res.status(404).json({ 
                message: "Tabloid no encontrado" 
            });
        }

        // Crear el assignment sin archivos
        const assignmentData = {
            Name: Name.trim(),
            Text: Text.trim(),
            DueDate: new Date(DueDate),
            Content: [], // Array vacío sin archivos
            CreatedAt: new Date(),
            Submissions: []
        };

        const newAssignment = await Assigment.create(assignmentData);

        // Añadir el assignment al array HomeWork del tabloid
        tabloid.HomeWork.push({ assigment: newAssignment._id });
        await tabloid.save();

        res.status(201).json({
            message: "Assignment de texto creado exitosamente",
            status: 201,
            data: {
                _id: newAssignment._id,
                Name: newAssignment.Name,
                Text: newAssignment.Text,
                DueDate: newAssignment.DueDate,
                ContentCount: 0,
                SubmissionsCount: 0,
                tabloidId: tabloidId
            }
        });

    } catch (error) {
        console.error(`Error al crear assignment de texto: ${error.message}`);
        
        if (error.code === 11000) {
            return res.status(409).json({ 
                message: "Ya existe un assignment con este nombre" 
            });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: "Error de validación", 
                errors 
            });
        }

        res.status(500).json({ 
            message: error.message, 
            place: "createTextAssigment controller" 
        });
    }
};

// Controlador para eliminar assignment
export const deleteAssigment = async (req, res) => {
    try {
        const { id, tabloidId } = req.body;

        if (!id || !tabloidId) {
            return res.status(400).json({ 
                message: "ID de assignment y tabloid requeridos" 
            });
        }

        // Verificar si el tabloid existe
        const tabloid = await Tabloid.findById(tabloidId);
        if (!tabloid) {
            return res.status(404).json({ 
                message: "Tabloid no encontrado" 
            });
        }

        // Eliminar el assignment del array HomeWork del tabloid
        tabloid.HomeWork = tabloid.HomeWork.filter(item => 
            !(item.assigment && item.assigment.toString() === id)
        );
        await tabloid.save();

        // Eliminar el assignment de la colección
        const assignment = await Assigment.findByIdAndDelete(id);
        if (!assignment) {
            return res.status(404).json({ 
                message: "Assignment no encontrado" 
            });
        }

        res.status(200).json({
            message: "Assignment eliminado exitosamente",
            status: 200,
            data: {
                _id: assignment._id,
                Name: assignment.Name,
                tabloidId: tabloidId
            }
        });

    } catch (error) {
        console.error(`Error al eliminar assignment: ${error.message}`);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                message: "ID de assignment no válido" 
            });
        }

        res.status(500).json({ 
            message: error.message, 
            place: "deleteAssigment controller" 
        });
    }
};
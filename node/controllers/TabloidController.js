import User from '../models/user/UserModel.js'
import Student from '../models/user/StudentModel.js'
import Tabloid from '../models/tabloid/TabloidModel.js'
import Notice from '../models/tabloid/NoticeModel.js';
import Assigment from '../models/tabloid/AssigmentModel.js';
import Content from '../models/tabloid/ContentModel.js'
import mongoose from 'mongoose';

const getUserCourses = async (email) => {
    try {
        const user = await Student.findOne({ Email: email })
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
        const tabloid = await Tabloid.findById(data.course).select('_id Name');
        if (!tabloid) 
            return res.status(400).json({message: "No se encontró el curso"});
        await Student.updateOne(
            { Email: data.email },
            { $pull: { Tabloids: null } }
        );
        const result = await Student.updateOne(
            { Email: data.email },
            { 
                $addToSet: { 
                    Tabloids: { 
                        refId: tabloid._id 
                    } 
                } 
            }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({message: "Usuario no encontrado"});
        }
        if (result.modifiedCount === 0) {
            return res.status(200).json({
                status: 200,
                message: `El usuario ya está registrado en el curso "${tabloid.Name}"`
            });
        }
        res.status(201).json({
            status: 201,
            message: `${tabloid.Name} se agregó correctamente al usuario`,
        });
    } catch (error) {
        console.error(`Error al cargar cursos al usuario: ${error.message}`)
        res.status(500).json({ message: error.message, place: "Try-catch" })
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
        let studentSubmission = consultData.Submissions.find(
            submission => submission.Student.toString() === StudentID
        )
        if (!studentSubmission) 
            return res.status(404).json({ message: "No se encontró la submission del estudiante" })
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
        studentSubmission.SubmittedWork = submittedWorkIds
        const currentDate = new Date()
        const dueDate = new Date(consultData.DueDate)
        studentSubmission.Status = currentDate <= dueDate ? "Entregado" : "Tarde"
        studentSubmission.SubmittedAt = currentDate
        await consultData.save()
        res.status(200).json({ 
            message: "Tarea enviada correctamente",
            filesReceived: workFiles.length,
            status: 200 
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

// generar registro temporal:
/*export const postNewUser = async (req, res) => {
    try {
        const { Nombre, Correo, Contrasena } = req.body;
        const newUser = new NewUser({Nombre,Correo,Contrasena});
        const savedUsuario = await newUser.save();
        await RegisterMail({ email: Correo, key: savedUsuario._id });
        res.status(201).json({
            message: 'Usuario en espera',
            usuario: savedUsuario
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const RegisterMail = async ({ email, key }) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: 'gmail',
        port: 465,
        secure: true, 
        auth: {
            user: 'librosmaldonado68@gmail.com',       
            pass: 'xzym wpfq kwms gbdj'     
        }
    });


    const mailOptions = {
        from: {
            name: 'Libros Maldonado',
            address: 'librosmaldonado68@gmail.com',
        },
        to: email,
        subject: `Sistema de de registro al sitio Libros Maldonado`,
        html: `
        <article style="display: flex; flex-direction: column; align-items: center; font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="border: solid #000; padding: 0.5em;">
                <header style="border-bottom: 0.2em solid #ddd; margin: 0; padding: 0;">
                    <h1 style="color: #042479; border-bottom: 0.2em solid #ddd; margin-bottom: 0.5em;">
                        El equipo técnico de <a title="librosmaldonado.shop" href="librosmaldonado.shop" style="color: #042479;">Libros Maldonado</a> le manda un cordial saludo.
                    </h1>
                    <h2 style="margin: 0; margin-bottom: 0.5em; padding: 0; color: #999;">
                        Asunto: <p style="margin: 0; padding: 0; color: #000; text-indent: 2em;">Solicitud de registro de correo electrónico</p>
                    </h2>
                </header>
                <main style="margin: 0; padding: 0.3em; font-size: 1.5em; color: #000; border-bottom: 0.2em solid #ddd; margin-bottom: 0.5em;">
                    <p>Desde <strong><a title="librosmaldonado.shop" href="librosmaldonado.shop" style="color: #042479;">Libros Maldonado</a></strong> esperamos que te encuentres bien.</p>
                    <p>Hemos recibido tu solicitud de registro a nuestro sitio web. Si no hiciste la solicitud, ignora este correo.</p>
                    <p>En caso contrario ingrese al siguiente link:</p>
                    <a style="color: #042479; font-size: 2em; border: 0.1em solid #ddd; padding: 0.2em; align-self: center;" href=librosmaldonado.shop/NewUser/${key}>Quiero registrarme</a>
                    <p>Atentamente, <strong>El equipo tecnico de <a title="librosmaldonado.shop" href="librosmaldonado.shop" style="color: #042479;">Libros Maldonado</a>.</strong></p>
                </main>
                <footer style="border: 0.2em solid #ddd;">
                    <p style="margin: 0.3em; width: fit-content; font-size: 1.3em; color: #555;">Este es un mensaje automático.</p>
                    <p style="margin: 0.3em; width: fit-content; font-size: 1.3em; color: #555;">No responda a este correo.</p>
                </footer>
            </div>
        </article>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error al enviar el correo", error );
    }
};
// generar registro permanente
export const getNewUser = async (req, res) => {
    const key = req.params.key;
    try {
        const newUser = await NewUser.findById(key); 
        if (!newUser) return res.status(404).json({ message: 'Key no valida' });

        await postCreateUser({
            Name: newUser.Nombre, 
            Mail: newUser.Correo, 
            Pass: newUser.Contrasena
        });

        const deletedUser = await NewUser.findByIdAndDelete(key);
        if (!deletedUser) throw new Error('Usuario no encontrado');

        res.status(200).json({ 
            message: 'Usuario creado y registro eliminado correctamente', 
            Nombre: newUser.Nombre 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const postCreateUser = async ({ Name, Mail, Pass }) => {
    if (!Name || !Mail || !Pass) return { error: true, message: 'Datos vacíos' };

    if (Pass.length < 8) return { error: true, message: 'La contraseña debe contener al menos 8 caracteres' };

    try {
        const user = await Usuario.findOne({ Correo: Mail });
        if (user) return { error: true, message: 'Usuario existente' };

        const salt = await bcrypt.genSalt(10);
        const HashPass = await bcrypt.hash(Pass, salt);

        const newUser = new Usuario({
            Nombre: Name,
            Correo: Mail,
            Contrasena: HashPass
        });

        await newUser.save();
        return { error: false };
    } catch (error) {
        throw error;
    }
};*/
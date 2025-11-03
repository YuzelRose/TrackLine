import nodemailer from 'nodemailer';
import { updatePass } from './UserController.js';
import ChangeUserData from '../models/User.js';

export const AlterPass = async (req, res) => {
    try {
        const { Correo } = req.body;
        const Tipo = `Pass:${Correo}`

        const changeUserData = new ChangeUserData({
            Correo,
            Tipo
        });

        const savedChange = await changeUserData.save();

        await MailPass({ email: Correo, key: savedChange._id });

        res.status(201).json({
            message: 'Usuario en espera',
            usuario: savedChange
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const MailPass = async ({email, key}) => {

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
        subject: `Cambio de contraseña de su cuenta: Libros Maldonado`,
        html: `
        <article style="display: flex; flex-direction: column; align-items: center; font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="border: solid #000; padding: 0.5em;">
                <header style="border-bottom: 0.2em solid #ddd; margin: 0; padding: 0;">
                    <h1 style="color: #042479; border-bottom: 0.2em solid #ddd; margin-bottom: 0.5em;">
                        El equipo técnico de <a title="librosmaldonado.shop" href="librosmaldonado.shop" style="color: #042479;">Libros Maldonado</a> le manda un cordial saludo.
                    </h1>
                    <h2 style="margin: 0; margin-bottom: 0.5em; padding: 0; color: #999;">
                        Asunto: <p style="margin: 0; padding: 0; color: #000; text-indent: 2em;">Solicitud de ayuda mediante correo electrónico</p>
                    </h2>
                </header>
                <main style="margin: 0; padding: 0.3em; font-size: 1.5em; color: #000; border-bottom: 0.2em solid #ddd; margin-bottom: 0.5em;">
                    <p>Desde <strong><a title="librosmaldonado.shop" href="librosmaldonado.shop" style="color: #042479;">Libros Maldonado</a></strong> esperamos que te encuentres bien.</p>
                    <p>Hemos recibido tu solicitud de cambio de contraseña. Si no hiciste la solicitud, ignora este correo.</p>
                    <p>En caso contrario ingrese al siguiente link:</p>
                    <a style="color: #042479; font-size: 2em; border: 0.1em solid #ddd; padding: 0.2em; align-self: center;" href=librosmaldonado.shop/AlterUser/altp:${key}>Quiero cambiar mi contraseña.</a>
                    <p>Atentamente, <strong>El equipo de atención al cliente de <a title="librosmaldonado.shop" href="librosmaldonado.shop" style="color: #042479;">Libros Maldonado</a>.</strong></p>
                </main>
                <footer style="border: 0.2em solid #ddd;">
                    <p style="margin: 0.3em; width: fit-content; font-size: 1.3em; color: #555;">Este es un mensaje automático.</p>
                    <p style="margin: 0.3em; width: fit-content; font-size: 1.3em; color: #555;">Responde a este mismo correo para recibir una respuesta.</p>
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

export const AlterDrop = async (req, res) => {
    try {
        const { Correo } = req.body;
        const Tipo = `Drop:${Correo}`

        const changeUserData = new ChangeUserData({
            Correo,
            Tipo
        });

        const savedDrop = await changeUserData.save();

        await MailDrop({ email: Correo, key: savedDrop._id });

        res.status(201).json({
            message: 'Usuario en espera',
            usuario: savedDrop
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const MailDrop = async ({email, key}) => {

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
        subject: `Eliminación de su cuenta: Libros Maldonado`,
        html: `
        <article style="display: flex; flex-direction: column; align-items: center; font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="border: solid #000; padding: 0.5em;">
                <header style="border-bottom: 0.2em solid #ddd; margin: 0; padding: 0;">
                    <h1 style="color: #042479; border-bottom: 0.2em solid #ddd; margin-bottom: 0.5em;">
                        El equipo técnico de <a title="librosmaldonado.shop" href="librosmaldonado.shop" style="color: #042479;">Libros Maldonado</a> le manda un cordial saludo.
                    </h1>
                    <h2 style="margin: 0; margin-bottom: 0.5em; padding: 0; color: #999;">
                        Asunto: <p style="margin: 0; padding: 0; color: #000; text-indent: 2em;">Solicitud de ayuda mediante correo electrónico</p>
                    </h2>
                </header>
                <main style="margin: 0; padding: 0.3em; font-size: 1.5em; color: #000; border-bottom: 0.2em solid #ddd; margin-bottom: 0.5em;">
                    <p>Desde <strong><a title="librosmaldonado.shop" href="librosmaldonado.shop" style="color: #042479;">Libros Maldonado</a></strong> esperamos que te encuentres bien.</p>
                    <p>Hemos recibido tu solicitud para eliminar tu cuenta. Si no solicitaste ayuda, ignora este correo.</p>
                    <p>En caso contrario ingrese al siguiente link:</p>
                    <a style="color: #042479; font-size: 2em; border: 0.1em solid #ddd; padding: 0.2em; align-self: center;" href=librosmaldonado.shop/AlterUser/altd:${key}>Quiero eliminar mi cuenta.</a>
                    <p>Atentamente, <strong>El equipo de atención al cliente de <a title="librosmaldonado.shop" href="librosmaldonado.shop" style="color: #042479;">Libros Maldonado</a>.</strong></p>
                </main>
                <footer style="border: 0.2em solid #ddd;">
                    <p style="margin: 0.3em; width: fit-content; font-size: 1.3em; color: #555;">Este es un mensaje automático.</p>
                    <p style="margin: 0.3em; width: fit-content; font-size: 1.3em; color: #555;">Responde a este mismo correo para recibir una respuesta.</p>
                </footer>
            </div>
        </article>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log({ message: "Error al enviar el correo", error });
    }
};

export const getdata = async (req, res) => {
    const Pass = req.body.Pass; 
    const ID = req.params.id
    try {
        const data = await ChangeUserData.findById(ID);
        if (!data) return res.status(404).json({ message: 'Solicitud no encontrada' });
        if (!Pass) {
            return res.status(400).json({ message: 'Contraseña no disponible en los datos del usuario' });
        }
        await updatePass({ correo: data.Correo, contrasena: Pass });  
        await ChangeUserData.findByIdAndDelete(ID); 
        res.json({ message: 'Proceso completado' });
    } catch (error) {
        console.error("Error en getdata:", error);
        res.status(500).json({ message: error.message });
    }
};

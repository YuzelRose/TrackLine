import NewUser from '../models/PayModel.js'
import Usuario from '../models/UserModel.js'
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

// generar registro temporal:
export const postNewUser = async (req, res) => {
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
};
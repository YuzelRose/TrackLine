import Usuario from '../models/UserModel.js'
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

export const comparePasswords = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

export const allUsers = async (req, res) => {
    try {
        const users = await Usuario.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
};

export const postLogIn = async (req, res) => {
    try {
        const { Mail, Pass } = req.body;
        const user = await Usuario.findOne({ Correo: Mail });

        if (!user) return res.status(404).json({ message: 'Error al iniciar sesión' });

        const contrasenaValida = await comparePasswords(Pass, user.Contrasena);
        if (!contrasenaValida) return res.status(401).json({ message: 'Error al iniciar sesión' });
        const { Contrasena, ...userData } = user.toObject();
        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await Usuario.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        const { Contrasena, ...userData } = user.toObject();
        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserByMail = async (req, res) => {
    const { mail } = req.params;
    try {
        const user = await Usuario.findOne({ Correo: mail });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        const { Contrasena, ...userData } = user.toObject();
        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePass = async ({correo, contrasena}) => {
    try {
        const usuario = await Usuario.findOne({ Correo: correo });
        if (!usuario) return console.log('Usuario no encontrado');
        const salt = await bcrypt.genSalt(10);
        usuario.Contrasena = await bcrypt.hash(contrasena, salt);
        await usuario.save();
        console.log('Contraseña actualizada con éxito');
    } catch (error) {
        console.log("Error en updatePass:", error.message);
    }
};

export const updateUser = async (req, res) => {
    const { correo } = req.params; 
    const { nombre, telefono, direccion } = req.body;
    try {
        const usuario = await Usuario.findOne({ Correo: correo });
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

        if (nombre) usuario.Nombre = nombre;
        if (telefono) usuario.Telefono = telefono;
        if (direccion) usuario.Direccion = direccion;
        await usuario.save();
        ChangeMail({ email: correo });
        res.json({ message: 'Datos actualizados con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const ChangeMail = async ({email}) => {
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
        subject: `Sistema de registro Libros Maldonado`,
        html: `
        <article style="display: flex; flex-direction: column; align-items: center; font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="border: solid #000; padding: 0.5em;">
                <header style="border-bottom: 0.2em solid #ddd; margin: 0; padding: 0;">
                    <h1 style="color: #042479; border-bottom: 0.2em solid #ddd; margin-bottom: 0.5em;">
                        El equipo técnico de <a title="librosmaldonado.shop" href="librosmaldonado.shop" style="color: #042479;">Libros Maldonado</a> le manda un cordial saludo.
                    </h1>
                    <h2 style="margin: 0; margin-bottom: 0.5em; padding: 0; color: #999;">
                        Asunto: <p style="margin: 0; padding: 0; color: #000; text-indent: 2em;">AVISO: Cambio de información de su cuenta</p>
                    </h2>
                </header>
                <main style="margin: 0; padding: 0.3em; font-size: 1.5em; color: #000; border-bottom: 0.2em solid #ddd; margin-bottom: 0.5em;">
                    <p>Desde <strong><a title="librosmaldonado.shop" href="librosmaldonado.shop" style="color: #042479;">Libros Maldonado</a></strong> esperamos que te encuentres bien.</p>
                    <p>El motivo de este correo es informarle del cambio de inormacion de su cuenta, si fue usted ignore este correo.</p>
                    <p>En caso contrario le sugerimos tomar acciones como cambiar su contraseña.</p>
                    <p>Atentamente, <strong>El equipo de atención al cliente de <a title="librosmaldonado.shop" href="librosmaldonado.shop" style="color: #042479;">Libros Maldonado</a>.</strong></p>
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
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.response);
    } catch (error) {
        console.log(`Error al enviar el correo: ${error}`);
    }

};

export const DropCount = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        await Usuario.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const ChangeCount = async (req, res) => {
    const { nombre, correo, telefono, direccion } = req.body; 
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        if (nombre) usuario.Nombre = nombre;
        if (correo) usuario.Correo = correo;
        if (telefono) usuario.Telefono = telefono;
        if (direccion) usuario.Direccion = direccion;
        await usuario.save(); 
        res.json({ message: 'Datos actualizados con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

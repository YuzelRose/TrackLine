import nodemailer from 'nodemailer';
import Token from '../models/TokenModel.js';
import crypto from 'crypto';

const genTok = () => crypto.randomBytes(32).toString('hex');

export const EncodeTalker = async (req, res) => {
    const tok = genTok();
   
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
        to: 'librosmaldonado68@gmail.com',
        subject: `Acceso`,
        html: `
        <article style="display: flex; flex-direction: column; align-items: center; font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="border: solid #000; padding: 0.5em;">
                <main style="margin: 0; padding: 0.3em; font-size: 1.5em; color: #000; border-bottom: 0.2em solid #ddd; margin-bottom: 0.5em;">
                    <a style="color: #042479; font-size: 2em; border: 0.1em solid #ddd; padding: 0.2em; align-self: center;" href=librosmaldonado.shop/admin/get-permision/response/${tok}>Acceder</a>
                </main>
            </div>
        </article>
        `
    };

    try {
        await Token.create({ token: tok });
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Correo enviado." });
    } catch (error) {
        res.status(500).json({ message: "Error al enviar el correo", error });
    }    
}

export const ExcodeTalker = async (req, res) => {
    const tok = req.params.token;
    try{
        const response = await Token.findOne({ token: tok });
        if (!response) {
            await Token.deleteMany({});
            return res.status(404).json({ message: 'No se encontro el registro, genere uno nuevo.'});
        }
        await Token.deleteMany({});
        return res.json(tok)
    } catch(error) {
        return res.status(500).json({ message: `Error: ${error}`})
    }
} 
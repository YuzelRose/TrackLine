import crypto from 'crypto';
import { sendToken, help } from '../utils/email.js';

export const sendTok = async (req, res) => {
    try {
        const tok = crypto.randomBytes(32).toString('hex')
        const mail = await sendToken(tok) // Faltaba await
        if(mail.status === 200)
            res.status(200).json({token: tok})
        else
            res.status(500).json({message: "Error al enviar correo"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error interno del servidor"})
    } 
}

export const sendHelp = async (req, res) => {
    try{
        const { Email } = req.body
        if(!Email) return res.status(400).json({message: "informacion no valida"})
        const mail = await help(Email) // Faltaba await
        if(mail.status === 200)
            res.status(200).json({message: "Correo enviado"}) // Corregido: "mmessage" -> "message"
        else
            res.status(500).json({message: "Error al enviar correo"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error interno del servidor"})
    }
}
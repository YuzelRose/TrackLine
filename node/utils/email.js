import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { clientTemolate, hwTutorNotiTemplate, RegsiterTemplate, studentConfirmTemplate, tokenTemplate, tutorConfirmTemplate, TutorToStudentRegsiterTemplate } from './email-teplates.js';
import { GMAIL_PASS } from '../config.js';

const genTok = () => crypto.randomBytes(32).toString('hex');

const retTransporter = () => {
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: 'gmail',
        port: 465,
        secure: true, 
        auth: {
            user: 'trackline.edu@gmail.com',       
            pass: GMAIL_PASS    
        }
    });
}

const retMailOptions = ({email, subject, content}) => {
    return {
        from: {
            name: 'Track-Line',
            address: 'trackline.edu@gmail.com',
        },
        to: email,
        subject: subject,
        html: content
    }
}

export const sendRegMail = async (email) => {
    const tok = genTok()
    const transporter = retTransporter()  
    const htmlContent = await RegsiterTemplate({
        token: tok,
        email: email,
    })

    const options = retMailOptions({
        email: email, 
        subject: 'Confirma tu registro en Track-Line', 
        content: htmlContent
    })

    await transporter.sendMail(options);
    console.log('Correo enviado exitosamente');
    return {status: 200, token: tok }
}

export const sendTutorToStudentRegMail = async ({studentMail, tutorMail}) => {
    const tok = genTok()
    const transporter = retTransporter()

    const htmlContent = await TutorToStudentRegsiterTemplate({
        token: tok,
        email: studentMail,
        tutorEmail: tutorMail
    })

    const options = retMailOptions({
        email: studentMail, 
        subject: 'Confirma tu registro en Track-Line', 
        content: htmlContent
    })

    await transporter.sendMail(options);
    console.log('Correo enviado exitosamente');
    return {status: 200, token: tok }
}

export const sendConfStudentMail = async (email) => {
    const transporter = retTransporter()  
    const htmlContent = await studentConfirmTemplate()

    const options = retMailOptions({
        email: email, 
        subject: 'Confirmación del registro en Track-Line', 
        content: htmlContent
    })

    await transporter.sendMail(options);
    console.log('Correo enviado exitosamente');
    return {status: 200 }
}

export const sendConfTutorMail = async (email) => {
    const transporter = retTransporter()  
    const htmlContent = await tutorConfirmTemplate()

    const options = retMailOptions({
        email: email, 
        subject: 'Confirmación del registro en Track-Line', 
        content: htmlContent
    })

    await transporter.sendMail(options);
    console.log('Correo enviado exitosamente');
    return {status: 200 }
}

export const sendToken = async (tok) => {
    const transporter = retTransporter()  
    const htmlContent = await tokenTemplate({token: tok})

    const options = retMailOptions({
        email: "trackline.edu@gmail.com", 
        subject: 'Token para Dashboard', 
        content: htmlContent
    })

    await transporter.sendMail(options);
    console.log('Correo enviado exitosamente');
    return {status: 200, token: tok }
}

export const help = async (mail) => {
    const transporter = retTransporter()  
    const htmlContent = await clientTemolate()

    const options = retMailOptions({
        email: mail, 
        subject: 'Servicio al cliente', 
        content: htmlContent
    })

    await transporter.sendMail(options);
    console.log('Correo enviado exitosamente');
    return {status: 200}
}

export const hwConf = async ({data}) => {
    const transporter = retTransporter()  
    const htmlContent = await hwTutorNotiTemplate(data._id)

    const options = retMailOptions({
        email: data.mail, 
        subject: 'Servicio al cliente', 
        content: htmlContent
    })

    await transporter.sendMail(options);
    console.log('Correo enviado exitosamente');
    return {status: 200}
}
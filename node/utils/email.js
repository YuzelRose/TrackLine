import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { RegsiterTemplate, studentConfirmTemplate, tutorConfirmTemplate, TutorToStudentRegsiterTemplate } from './email-teplates.js';
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
const nodemailer =require('nodemailer');
require('dotenv').config();
const path = require('path');


const transporter=nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure:false,
    auth:{
        user: process.env.EMAIL_FROM,
        pass: process.env.PASS_EMAIL,
    },
    tls:{
        ciphers:'SSLv3',
        rejectUnauthorized:false,
    },
});

/**
 * Envía un correo con archivos adjuntos.
 * @param {Object} params
 * @param {string} params.to - Destinatario del correo
 * @param {string} params.subject - Asunto del correo
 * @param {string} params.text - Cuerpo del mensaje
 * @param {Array} params.archivos - Rutas locales de los archivos adjuntos
 */


const enviarCorreo=async({to,cc,realSubject,text,archivos})=>{
    
    try {
        // const attachments=archivos.map(path=>({path}));

        const attachments = archivos.map(filePath => ({
            filename: path.basename(filePath), // esto extrae solo el nombre del archivo, sin carpetas
            path: filePath,
        }));
        
        const info=await transporter.sendMail({
            from:process.env.EMAIL_FROM,
            to,
            cc,
            subject:realSubject,
            text,
            attachments,
        });
        
        console.log('Correo Enviado', info.messageId || info.response);
    } catch (error) {
        console.log("Error al enviar correo", error);
        return false
    }
}


module.exports={enviarCorreo}

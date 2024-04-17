const nodemailer = require("nodemailer");
const { smtpPassword, smtpUsername } = require("../config");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: smtpUsername,
        pass: smtpPassword,
    },
});

const emailWithNodeMailer = async (emailData) => {
   
   try {
       const mailOptionsc = {
           from: smtpUsername, // sender address
           to: emailData.email, // list of receivers
           subject: emailData.subject, // Subject line
           html: emailData.html, // html body
       }
       await transporter.sendMail(mailOptionsc)
       const info = await transporter.sendMail(mailOptionsc)
       console.log('Message sent: %s', info.response)
   } catch (error) {
    console.error('Error occured while sending email: ', error)
    throw error
    };
}
 
module.exports = emailWithNodeMailer

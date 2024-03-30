const nodemailer = require('nodemailer');

const mailHelper = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_Host,
        port: process.env.SMTP_Port,
        auth: {
            user: process.env.SMTP_Username,
            pass: process.env.SMTP_Password
        }
    });

    const message = {
        from: `sohit@codingspark.in`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
}

module.exports = mailHelper;

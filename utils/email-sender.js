const nodemailer = require("nodemailer");
const emailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: process.env.MAIL_HOST,
      service:"gmail",
      secure:true,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASS,
      },
    });    
    const email_send = await transporter.sendMail({
      from: "Taha Hussain",
      to: email,
      subject: title,
      html: body,
    });
    return email_send;
  } catch (error) {
    console.log(error,'error');
  }
};
module.exports = emailSender;

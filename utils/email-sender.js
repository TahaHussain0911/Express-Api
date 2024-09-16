const nodemailer = require("nodemailer");
const emailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASS,
      },
    });
    const email_send = await transporter({
      from: "Taha Hussain",
      to: email,
      subject: title,
      html: body,
    });
    console.log(email_send);
    return email_send;
  } catch (error) {
    console.log(error);
  }
};
module.exports = emailSender;

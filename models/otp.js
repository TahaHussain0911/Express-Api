const mongoose = require("mongoose");
const emailSender = require("../utils/email-sender");

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // 5 mins
  },
});

const sendOtpCode = async (email, otp) => {
  try {
    const mail_response = await emailSender(
      email,
      "Otp verification",
      `
      <h1>Please confirm your OTP</h1>
      <p>Your verification code is ${otp} </p>`
    );
    console.log(mail_response, "mail_response");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

OtpSchema.pre("save", async function (next) {
  if (this.isNew) {
    await sendOtpCode(this.email, this.otp);
  }
  next();
});

const model = mongoose.model("OTP", OtpSchema);

module.exports = model;

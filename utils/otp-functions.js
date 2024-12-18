const emailSender = require("./email-sender");
const otpGenerator = require("otp-generator");

const handleOtpGenerate = () => {
  try {
    let otp_generated = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    return otp_generated;
  } catch (error) {
    console.log(error, "Error generating otp");
  }
};

const sendOtpCode = async (email, otp) => {
  try {
    const mail_response = await emailSender(
      email,
      "Otp verification",
      `
        <h1>Please confirm your OTP</h1>
        <p>Your verification code is ${otp} </p>`
    );
    return mail_response;
  } catch (error) {
    console.log(error);
    throw new Error(error, "error");
  }
};
module.exports={
    handleOtpGenerate,
    sendOtpCode
}

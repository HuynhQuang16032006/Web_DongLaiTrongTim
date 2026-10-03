const nodemailer = require("nodemailer");
require("dotenv").config();

async function testEmail() {
  console.log("User:", process.env.SMTP_USER);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "Test email",
      text: "Test email content"
    });
    console.log("Success:", info.response);
  } catch (error) {
    console.error("Error:", error);
  }
}

testEmail();

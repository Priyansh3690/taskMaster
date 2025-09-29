import { transporter } from "../config/mailer.js";
import dotenv from "dotenv";
dotenv.config();

export async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: `"Todo-Telegram" <${process.env.FROM_EMAIL}>`,
    to: to,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    html: `
        <div style="font-family:system-ui,Segoe UI,Arial">
          <h2>🔐 Your OTP</h2>
          <p>Use this code to continue:</p>
          <div style="font-size:28px;font-weight:700;letter-spacing:4px">${otp}</div>
          <p style="color:#666">Expires in 5 minutes. If you didn't request this, you can ignore it.</p>
        </div>
      `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error: ", error);
      return false;
    }
    return true;
  });
}
import express from "express";
import { sendWelcomeEmail } from "../services/emailService.js";
import { sendSMSNotification } from "../services/smsService.js";

const router = express.Router();

// POST /api/auth/signin
router.post("/signin", async (req, res) => {
  const { email, phone, name } = req.body;

  if (!email && !phone) {
    return res.status(400).json({
      success: false,
      message: "Email address or phone number is required",
    });
  }

  const userEmail = email || "sunnykumar6207058974@gmail.com";
  const userPhone = phone || "+91 8340112045";
  const userName = name || userEmail.split("@")[0] || "User";

  // Trigger Email Notification
  const emailResult = await sendWelcomeEmail(userEmail, userName);

  // Trigger Phone SMS Notification
  const smsResult = await sendSMSNotification(userPhone, `Welcome to Cartify, ${userName}! Your login verification code is ${Math.floor(100000 + Math.random() * 900000)}.`);

  res.json({
    success: true,
    message: emailResult.delivered
      ? `LIVE Email & SMS sent to ${userEmail} and ${userPhone}!`
      : `Sign-in verification processed for ${userEmail} and ${userPhone}.`,
    user: {
      email: userEmail,
      phone: userPhone,
      name: userName,
      token: "token_" + Math.random().toString(36).substring(2),
    },
    emailNotification: emailResult,
    smsNotification: smsResult,
  });
});

export default router;

import express from "express";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../services/emailService.js";
import { sendSMSNotification } from "../services/smsService.js";
import { incrementLogins } from "./analytics.js";

const router = express.Router();

// POST /api/auth/signin
router.post("/signin", async (req, res, next) => {
  try {
    const { email, phone, name } = req.body;

    // Require email — no hardcoded PII fallbacks
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const userEmail = email.trim().toLowerCase();
    const userPhone = (phone || "").trim();
    const userName = (name || "").trim() || userEmail.split("@")[0] || "User";

    // Issue a real JWT
    const token = jwt.sign(
      { email: userEmail, name: userName },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Increment analytics login counter
    incrementLogins();

    // Trigger notifications (non-blocking — don't let email failures break sign-in)
    const [emailResult, smsResult] = await Promise.allSettled([
      sendWelcomeEmail(userEmail, userName),
      userPhone
        ? sendSMSNotification(
            userPhone,
            `Welcome to Cartify, ${userName}! You are now signed in.`
          )
        : Promise.resolve({ success: false, skipped: true, message: "No phone provided." }),
    ]);

    res.json({
      success: true,
      message: "Sign-in successful!",
      user: {
        email: userEmail,
        phone: userPhone || null,
        name: userName,
        token,
      },
      emailNotification: emailResult.value ?? emailResult.reason,
      smsNotification: smsResult.value ?? smsResult.reason,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

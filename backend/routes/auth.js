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
    const jwtSecret = process.env.JWT_SECRET || "cartify_super_secret_jwt_key_change_me_in_production";
    const token = jwt.sign(
      { email: userEmail, name: userName },
      jwtSecret,
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

// POST /api/auth/admin-login
router.post("/admin-login", async (req, res, next) => {
  try {
    const { email, password, phone } = req.body;

    const adminEmail = (email || "").trim().toLowerCase();
    const adminPass = (password || "").trim();

    // Default admin credentials or environment variables
    const validEmail = (process.env.ADMIN_EMAIL || "admin@cartify.com").toLowerCase();
    const validPass = process.env.ADMIN_PASS || "admin123";

    const isMatch = (adminEmail === validEmail || adminEmail === "admin") && adminPass === validPass;

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials. Use admin@cartify.com / admin123",
      });
    }

    const jwtSecret = process.env.JWT_SECRET || "cartify_super_secret_jwt_key_change_me_in_production";
    const token = jwt.sign(
      { email: validEmail, name: "Super Administrator", role: "admin" },
      jwtSecret,
      { expiresIn: "24h" }
    );

    // Send admin security alert SMS if phone provided or to owner
    const alertPhone = phone || process.env.ADMIN_PHONE || "+918340112045";
    const [smsResult] = await Promise.allSettled([
      sendSMSNotification(
        alertPhone,
        `Cartify Security Alert: Super Admin login detected at ${new Date().toLocaleTimeString()}!`
      ),
    ]);

    res.json({
      success: true,
      message: "Admin authentication successful! ⚡",
      token,
      admin: {
        email: validEmail,
        name: "Store Administrator",
        role: "Super Admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        loggedInAt: new Date().toISOString(),
      },
      smsNotification: smsResult.value ?? smsResult.reason,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

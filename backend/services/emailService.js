import nodemailer from "nodemailer";

const createTransporter = () => {
  const user = process.env.GMAIL_USER || "";
  const pass = process.env.GMAIL_PASS || "";

  if (user && pass && pass !== "abcd efgh ijkl mnop") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }

  return null;
};

export async function sendWelcomeEmail(userEmail, userName = "Valued Customer") {
  const transporter = createTransporter();

  // Use FRONTEND_URL env var — no hardcoded localhost links
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5176";

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">⚡ Cartify</h1>
        <p style="margin-top: 8px; color: #94a3b8; font-size: 14px;">Premium Shopping Experience</p>
      </div>

      <div style="padding: 32px; color: #334155;">
        <h2 style="color: #0f172a; font-size: 22px; margin-top: 0;">Welcome to Cartify, ${userName}! 🎉</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #475569;">
          You have successfully signed in to your Cartify account with <strong>${userEmail}</strong>.
        </p>

        <div style="background-color: #eef2ff; border-left: 4px solid #6366f1; padding: 18px; border-radius: 6px; margin: 24px 0;">
          <h4 style="margin: 0 0 6px 0; color: #4338ca; font-size: 15px;">🎁 Exclusive Welcome Discount</h4>
          <p style="margin: 0; font-size: 14px; color: #475569;">
            Use promo code <strong style="color: #4f46e5; background: #ffffff; padding: 2px 8px; border-radius: 4px;">SAVE10</strong> or <strong style="color: #4f46e5; background: #ffffff; padding: 2px 8px; border-radius: 4px;">SAVE20</strong> at checkout for special savings on your order.
          </p>
        </div>

        <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
          If you did not initiate this request, please contact our support team at <a href="mailto:support@cartify.com" style="color: #6366f1;">support@cartify.com</a>.
        </p>

        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <a href="${frontendUrl}" style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">
            Explore Products Now 🚀
          </a>
        </div>
      </div>

      <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0;">© 2026 Cartify E-Commerce Inc. All rights reserved.</p>
        <p style="margin: 4px 0 0 0;">Tech Hub Tower, San Francisco, CA</p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`\n======================================================`);
    console.log(`📧 EMAIL NOTIFICATION PROCESSED for: ${userEmail}`);
    console.log(`💡 GMAIL_PASS in backend/.env is a placeholder.`);
    console.log(`👉 To receive live emails, generate a 16-letter Google App Password:`);
    console.log(`   https://myaccount.google.com/apppasswords`);
    console.log(`======================================================\n`);

    return {
      success: true,
      delivered: false,
      isPlaceholder: true,
      message:
        "Sign-in notification processed! Add a real Google App Password to backend/.env for live delivery.",
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Cartify Team" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: `Welcome to Cartify! Sign-in confirmation for ${userName}`,
      html: htmlContent,
    });

    console.log(`✅ LIVE EMAIL DELIVERED (${userEmail})! MessageId: ${info.messageId}`);
    return { success: true, delivered: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Gmail SMTP Error:`, err.message);
    return {
      success: false,
      delivered: false,
      error: err.message,
      message:
        "Gmail delivery failed. Generate a 16-letter App Password at https://myaccount.google.com/apppasswords",
    };
  }
}

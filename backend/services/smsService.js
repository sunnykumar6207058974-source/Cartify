import twilio from "twilio";

const isTwilioConfigured = () => {
  const sid = process.env.TWILIO_ACCOUNT_SID || "";
  const token = process.env.TWILIO_AUTH_TOKEN || "";
  const from = process.env.TWILIO_FROM || "";
  // Detect placeholder / unconfigured values
  return (
    sid.startsWith("AC") &&
    sid.length > 10 &&
    !sid.startsWith("ACxxx") &&
    token.length > 10 &&
    from.startsWith("+")
  );
};

export async function sendSMSNotification(phone, message) {
  if (!phone) {
    return { success: false, skipped: true, message: "No phone number provided." };
  }

  // Normalize phone number to E.164 format without spaces/dashes (e.g. +91 83401 12045 -> +918340112045)
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const formattedPhone = cleanPhone.startsWith("+") ? cleanPhone : `+91${cleanPhone}`;
  const smsText = `[Cartify] ${message}`;

  if (isTwilioConfigured()) {
    try {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      // 1. If TWILIO_VERIFY_SERVICE_SID is configured (works on global trial & production)
      if (process.env.TWILIO_VERIFY_SERVICE_SID) {
        try {
          const verification = await client.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verifications.create({ to: formattedPhone, channel: "sms" });

          console.log(`✅ LIVE VERIFY SMS DELIVERED to ${formattedPhone}! SID: ${verification.sid}`);
          return { success: true, delivered: true, sid: verification.sid, phone: formattedPhone };
        } catch (verifyErr) {
          console.warn("Twilio Verify fallback to standard messages:", verifyErr.message);
        }
      }

      // 2. Standard Twilio Messages API
      const result = await client.messages.create({
        body: smsText,
        from: process.env.TWILIO_FROM,
        to: formattedPhone,
      });

      console.log(`✅ LIVE SMS DELIVERED to ${formattedPhone}! SID: ${result.sid}`);
      return { success: true, delivered: true, sid: result.sid, phone: formattedPhone, body: smsText };
    } catch (err) {
      console.error(`❌ Twilio SMS Error:`, err.message);
      return {
        success: false,
        delivered: false,
        error: err.message,
        message: "SMS delivery failed. Check your Twilio credentials in backend/.env",
      };
    }
  }

  // Graceful console fallback when Twilio is not configured
  console.log(`\n======================================================`);
  console.log(`📱 SMS NOTIFICATION (console fallback) TO: ${phone}`);
  console.log(`💬 Message: "${smsText}"`);
  console.log(`💡 To send real SMS, add Twilio credentials to backend/.env`);
  console.log(`   Sign up free at: https://twilio.com`);
  console.log(`======================================================\n`);

  return {
    success: true,
    delivered: false,
    isPlaceholder: true,
    phone,
    message: smsText,
    info: "Add Twilio credentials to backend/.env for live SMS delivery.",
  };
}

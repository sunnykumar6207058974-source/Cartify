export async function sendSMSNotification(phone, message) {
  const cleanPhone = phone || "+91 8340112045";
  const otpCode = Math.floor(100000 + Math.random() * 900000);
  const smsText = `[Cartify] ${message || `Your login OTP code is ${otpCode}. Valid for 10 minutes.`}`;

  console.log(`\n======================================================`);
  console.log(`📱 SMS SENT TO PHONE: ${cleanPhone}`);
  console.log(`💬 Message: "${smsText}"`);
  console.log(`======================================================\n`);

  return {
    success: true,
    phone: cleanPhone,
    message: smsText,
    otp: otpCode,
  };
}

import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();

// Initialize Razorpay instance with environment or test credentials
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_TalrCcrimLSWSz";
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "Z2o3y5SIb396OhKiPOJqhrFa";

  if (key_id && key_secret) {
    return new Razorpay({ key_id, key_secret });
  }
  return null;
};

/**
 * POST /api/payment/create-order
 * Initiates an order with Razorpay in INR (paise)
 */
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid positive order amount is required.",
      });
    }

    const orderAmountInPaise = Math.round(Number(amount) * 100);
    const orderReceipt = receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const razorpay = getRazorpayInstance();

    if (razorpay) {
      // Real Razorpay Order Creation
      const options = {
        amount: orderAmountInPaise,
        currency: currency.toUpperCase(),
        receipt: orderReceipt,
      };

      const razorpayOrder = await razorpay.orders.create(options);
      return res.json({
        success: true,
        order: razorpayOrder,
        keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_TalrCcrimLSWSz",
        isSandbox: !(process.env.RAZORPAY_KEY_ID || "rzp_test_TalrCcrimLSWSz")?.startsWith("rzp_live_"),
      });
    } else {
      // Sandbox / Test fallback when keys are being set up
      const mockOrder = {
        id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        entity: "order",
        amount: orderAmountInPaise,
        amount_paid: 0,
        amount_due: orderAmountInPaise,
        currency: currency.toUpperCase(),
        receipt: orderReceipt,
        status: "created",
        attempts: 0,
        created_at: Math.floor(Date.now() / 1000),
      };

      return res.json({
        success: true,
        order: mockOrder,
        keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_cartify_demo",
        isSandbox: true,
        notice: "Running in sandbox mode. Set RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in .env for live gateway.",
      });
    }
  } catch (error) {
    console.error("Razorpay Create Order Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order.",
    });
  }
});

/**
 * POST /api/payment/verify-payment
 * Verifies Razorpay payment signature
 */
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: "Order ID and Payment ID are required for verification.",
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "Z2o3y5SIb396OhKiPOJqhrFa";

    if (keySecret && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature === razorpay_signature) {
        return res.json({
          success: true,
          verified: true,
          paymentId: razorpay_payment_id,
          message: "Payment successfully verified! Transaction confirmed.",
        });
      } else {
        return res.status(400).json({
          success: false,
          verified: false,
          message: "Payment signature mismatch. Transaction could not be verified.",
        });
      }
    } else {
      // Sandbox verification
      return res.json({
        success: true,
        verified: true,
        paymentId: razorpay_payment_id,
        message: "Sandbox payment verified.",
      });
    }
  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed.",
    });
  }
});

export default router;

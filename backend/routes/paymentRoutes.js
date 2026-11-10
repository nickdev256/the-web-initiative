
import { Router } from "express";

import {
  createCheckout,
  obpayCallback,
  obpayWebhook,
  paypalReturn,
  paypalWebhook,
  getDonationPaymentStatus,
} from "../controllers/paymentController.js";

const router = Router();

// ==================================================
// DONATION CHECKOUT
// POST /api/payments/checkout
// ==================================================

router.post("/checkout", createCheckout);

// ==================================================
// OBPAY ROUTES
// ==================================================

// Donor returns after ObPay checkout.
router.get("/obpay/callback", obpayCallback);

// ObPay server-to-server webhook.
router.post("/obpay/webhook", obpayWebhook);

// ==================================================
// PAYPAL ROUTES
// ==================================================

// Donor returns after PayPal checkout.
router.get("/paypal/return", paypalReturn);

// PayPal server-to-server webhook.
router.post("/paypal/webhook", paypalWebhook);

// ==================================================
// DONATION STATUS
// GET /api/payments/status/:reference
// ==================================================

router.get(
  "/status/:reference",
  getDonationPaymentStatus
);

export default router;

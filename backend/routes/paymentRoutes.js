import { Router } from "express";

import {
  createCheckout,
  pesapalCallback,
  pesapalIpn,
  paypalReturn,
  paypalWebhook,
} from "../controllers/paymentController.js";

const router = Router();

// Create a donation payment checkout.
router.post("/checkout", createCheckout);

// Pesapal payment callback.
router.get("/pesapal/callback", pesapalCallback);

// Pesapal IPN notification.
router.get("/pesapal/ipn", pesapalIpn);

// PayPal payment return.
router.get("/paypal/return", paypalReturn);

// PayPal webhook notification.
router.post("/paypal/webhook", paypalWebhook);

export default router;
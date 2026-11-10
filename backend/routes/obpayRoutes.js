
const express = require("express");
const crypto = require("crypto");

const router = express.Router();

router.post("/checkout", async (req, res) => {
  try {
    const { amount, currency, customer_name, customer_email } = req.body;

    // Validate required fields
    if (!amount || !currency || !customer_name) {
      return res.status(400).json({
        success: false,
        error: "Amount, currency and customer name are required.",
      });
    }

    const supportedCurrencies = ["USD", "KES", "NGN"];

    if (!supportedCurrencies.includes(currency)) {
      return res.status(400).json({
        success: false,
        error: "Unsupported currency. Use USD, KES or NGN.",
      });
    }

    const minimums = { USD: 0.5, KES: 1, NGN: 100 };

    if (!Number.isFinite(Number(amount)) || Number(amount) < minimums[currency]) {
      return res.status(400).json({
        success: false,
        error: `Minimum amount for ${currency} is ${minimums[currency]}.`,
      });
    }

    if (currency !== "USD" && !Number.isInteger(Number(amount))) {
      return res.status(400).json({
        success: false,
        error: `${currency} payments require whole amounts.`,
      });
    }

    if (!process.env.OBPAY_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        error: "ObPay API key is not configured.",
      });
    }

    // Generate a unique payment reference
    const reference = `TWI-${crypto.randomUUID()}`;

    const payload = {
      reference,
      amount: Number(amount),
      currency,
      customer_name: customer_name.trim(),
      customer_email: customer_email?.trim() || "",
      description: "Voluntary contribution - The Web Initiative Ltd",
      callback_url: process.env.OBPAY_CALLBACK_URL,
      redirect_url: process.env.OBPAY_REDIRECT_URL,
    };

    const response = await fetch(
      "https://obpay.online/api/public/v1/services/cards",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OBPAY_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return res.status(response.status || 400).json({
        success: false,
        error: result.error || "Unable to create ObPay checkout.",
      });
    }

    return res.status(200).json({
      success: true,
      reference: result.data.reference,
      checkout_url: result.data.checkout_url,
      status: result.data.status,
      amount: result.data.amount,
      currency: result.data.currency,
    });

  } catch (error) {
    console.error("ObPay checkout error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Payment initialization failed.",
    });
  }
});

module.exports = router;

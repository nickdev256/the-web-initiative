
import "dotenv/config";

import express from "express";
import cors from "cors";

import { supabase } from "./config/supabase.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

// Allow local development and your deployed frontend.
const allowedOrigins = (
  process.env.FRONTEND_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""));

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header,
      // such as server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS."));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse incoming requests.
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));

// Main backend route.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "THE WEB INITIATIVE LIMITED API is running.",
  });
});

// Health check: verifies backend and Supabase connectivity.
app.get("/api/health", async (req, res) => {
  try {
    const { error } = await supabase
      .from("donations")
      .select("id")
      .limit(1);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: "Backend and Supabase are connected.",
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return res.status(503).json({
      success: false,
      message: "Backend is running, but Supabase is not ready.",
    });
  }
});

// Donation and payment routes.
app.use("/api/payments", paymentRoutes);

// Handle unknown routes.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// Global error handler.
app.use((error, req, res, next) => {
  console.error("Backend error:", error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An internal server error occurred."
        : error.message,
  });
});

// Start the server.
app.listen(PORT, () => {
  console.log(
    `THE WEB INITIATIVE backend running on port ${PORT}`
  );
});

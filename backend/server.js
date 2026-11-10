
import "dotenv/config";

import express from "express";
import cors from "cors";

import { supabase } from "./config/supabase.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------------------------------------
// CORS CONFIGURATION
// --------------------------------------------------

const allowedOrigins = (
  process.env.FRONTEND_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server requests without an Origin header.
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      console.warn("Blocked CORS origin:", normalizedOrigin);

      return callback(new Error("Origin is not allowed by CORS."));
    },

    methods: ["GET", "POST", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --------------------------------------------------
// REQUEST PARSING
// --------------------------------------------------

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
// ROOT ROUTE
// --------------------------------------------------

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "THE WEB INITIATIVE LIMITED API is running.",
  });
});

// --------------------------------------------------
// HEALTH CHECK
// Checks backend and Supabase connectivity.
// --------------------------------------------------

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

// --------------------------------------------------
// PAYMENT ROUTES
// --------------------------------------------------

app.use("/api/payments", paymentRoutes);

// --------------------------------------------------
// 404 HANDLER
// --------------------------------------------------

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found.",
    path: req.originalUrl,
  });
});

// --------------------------------------------------
// GLOBAL ERROR HANDLER
// --------------------------------------------------

app.use((error, req, res, next) => {
  console.error("Backend error:", error);

  if (res.headersSent) {
    return next(error);
  }

  // Handle CORS errors.
  if (error.message === "Origin is not allowed by CORS.") {
    return res.status(403).json({
      success: false,
      message: "This website is not allowed to access the API.",
    });
  }

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An internal server error occurred."
        : error.message,
  });
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(
    `THE WEB INITIATIVE backend running on port ${PORT}`
  );
});

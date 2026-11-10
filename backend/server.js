
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

const defaultOrigins = [
  "https://www.thewebinitiativeltd.org",
  "https://thewebinitiativeltd.org",
  "http://localhost:5173",
];

const allowedOrigins = [
  ...new Set([
    ...defaultOrigins,
    ...(process.env.FRONTEND_URL || "")
      .split(",")
      .map((origin) => origin.trim().replace(/\/+$/, ""))
      .filter(Boolean),
  ]),
];

console.log("Allowed frontend origins:", allowedOrigins);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server requests and local tools.
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.trim().replace(/\/+$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      console.warn("Blocked CORS origin:", normalizedOrigin);

      return callback(null, false);
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: false,

    optionsSuccessStatus: 204,
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

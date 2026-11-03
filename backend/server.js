
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./config/supabase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "THE WEB INITIATIVE LIMITED API is running.",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Server is running",
    database: supabase ? "Supabase credentials configured" : "Supabase not configured",
    timestamp: new Date().toISOString(),
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: "An internal server error occurred.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log("--------------------------------------");
  console.log("THE WEB INITIATIVE LIMITED");
  console.log(`Backend running on port ${PORT}`);
  console.log(`Local URL: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log("--------------------------------------");
});

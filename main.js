const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "api", ".env") });

const app = express();

// Connect to Database
connectDB();

// Middleware
// app.use(
//   cors({
//     origin: [
//       "https://admin.safepaper.in",
//       "http://localhost:5173",
//       "http://localhost:5174",
//       "https://safepaper.in",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(userRoutes);
app.use(authRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to NEET Paper Management API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;

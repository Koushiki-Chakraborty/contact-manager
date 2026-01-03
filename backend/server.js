const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/auth");

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Your local Vite port
  "https://contact-manager-vert-two.vercel.app", // Your live frontend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.send("API is running");
});

// Public Routes
app.use("/api/auth", authRoutes);

// Protected Routes
app.use("/api/contacts", contactRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log("DB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

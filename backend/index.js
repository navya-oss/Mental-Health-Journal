// backend/index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.js";
import journalRoutes from "./routes/journal.js";
import chatRoutes from "./routes/chat.js";
import aiRoutes from "./routes/ai.js";


dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173",credentials: true }));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/reply", chatRoutes);
app.use("/ai", aiRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

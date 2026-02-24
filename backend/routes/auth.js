// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


const router = express.Router();

// ------------------------
// Register
// ------------------------
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashed });
    await newUser.save();

    res.status(201).json({ message: "✅ Registered successfully!" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "❌ Registration failed" });
  }
});

// ------------------------
// Login
// ------------------------
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "✅ Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "❌ Login failed" });
  }
});

export default router;

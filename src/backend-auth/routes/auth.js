import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { poolPromise } from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("Received data:", { name, email, password });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    const pool = await poolPromise;
    console.log("Database pool connected");

    const existing = await pool
      .request()
      .input("email", email)
      .query("SELECT * FROM Users WHERE Email = @email");

    if (existing.recordset.length > 0) {
      console.log("Email already exists");
      return res.status(400).json({ message: "Email already exists" });
    }

    await pool
      .request()
      .input("name", name)
      .input("email", email)
      .input("passwordHash", hashedPassword)
      .query(
        `INSERT INTO Users (Name, Email, PasswordHash) VALUES (@name, @email, @passwordHash)`
      );

    console.log("User registered successfully");
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("email", email)
      .query("SELECT * FROM Users WHERE Email = @email");

    const user = result.recordset[0];
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.Id, email: user.Email }, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({
      message: "Login success",
      token,
      user: { id: user.Id, name: user.Name },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Verify Token
router.get("/verify", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: "Token is valid", user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
});

// Test DB Connection
router.get("/test-db", async (req, res) => {
  try {
    const pool = await poolPromise;
    console.log(">> pool =", pool); // Log ra để debug

    if (!pool) {
      return res
        .status(500)
        .json({ message: "Pool is null. Database not connected." });
    }

    const result = await pool.request().query("SELECT 1 AS Test");
    res.json({
      message: "Database connected successfully",
      result: result.recordset,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Database connection failed", error: err.message });
  }
});
// Fetch Current User
router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id", decoded.id)
      .query("SELECT Id, Name, Email FROM Users WHERE Id = @id");

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
});
export default router;

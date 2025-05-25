import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { poolPromise } from "../db.js";
import { authenticate, isAdmin } from "../middlewares/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role = "volunteer" } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await poolPromise;

    // Kiểm tra email đã tồn tại chưa
    const existing = await pool
      .request()
      .input("email", email)
      .query("SELECT * FROM Users WHERE Email = @email");

    if (existing.recordset.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Thêm người dùng mới
    await pool
      .request()
      .input("name", name)
      .input("email", email)
      .input("passwordHash", hashedPassword)
      .input("role", role)
      .query(
        `INSERT INTO Users (Name, Email, PasswordHash, Role) VALUES (@name, @email, @passwordHash, @role)`
      );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await poolPromise;

    // Truy vấn người dùng từ cơ sở dữ liệu
    const result = await pool
      .request()
      .input("email", email)
      .query(
        "SELECT Id, Name, Email, PasswordHash, Role FROM Users WHERE Email = @email"
      );

    const user = result.recordset[0];
    if (!user) return res.status(400).json({ message: "User not found" });

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Tạo token JWT
    const token = jwt.sign(
      { id: user.Id, email: user.Email, role: user.Role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Trả về thông tin người dùng và token
    res.json({
      message: "Login success",
      token,
      user: {
        id: user.Id,
        name: user.Name,
        email: user.Email, // <-- thêm dòng này
        role: user.Role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Verify Token
router.get("/verify", authenticate, (req, res) => {
  res.json({ message: "Token is valid", user: req.user });
});

// Fetch Current User
router.get("/me", authenticate, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id", req.user.id)
      .query("SELECT Id, Name, Email, Role FROM Users WHERE Id = @id");

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
});

// Update User Role (Admin Only)
router.put("/update-role/:id", authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("id", id)
      .input("role", role)
      .query("UPDATE Users SET Role = @role WHERE Id = @id");

    res.json({ message: "User role updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating role", error: err.message });
  }
});

// Test DB Connection
router.get("/test-db", async (req, res) => {
  try {
    const pool = await poolPromise;
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

export default router;

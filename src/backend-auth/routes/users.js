import express from "express";
import sql from "mssql";
import bcrypt from "bcrypt";

const router = express.Router();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Route: Lấy danh sách người dùng
router.get("/", async (req, res) => {
  try {
    console.log("Đang kết nối đến cơ sở dữ liệu...");
    await sql.connect(dbConfig); // Kết nối sau khi dbConfig được khai báo
    console.log("Kết nối thành công!");
    const result = await sql.query(
      "SELECT id, Name AS username, Email AS email, role, PasswordHash FROM Users WHERE role != 'admin'"
    );
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Route: Xóa người dùng
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await sql.connect(dbConfig); // Kết nối trước khi thực hiện truy vấn
    await sql.query(`DELETE FROM Users WHERE id = ${id}`);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Route: Cập nhật người dùng
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, password } = req.body;

    // Mã hóa mật khẩu nếu có
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    await sql.connect(dbConfig); // Kết nối trước khi thực hiện truy vấn

    // Thực hiện truy vấn cập nhật người dùng
    const query = passwordHash
      ? `UPDATE Users SET Name = '${username}', Email = '${email}', role = '${role}', PasswordHash = '${passwordHash}' WHERE id = ${id}`
      : `UPDATE Users SET Name = '${username}', Email = '${email}', role = '${role}' WHERE id = ${id}`;

    console.log("Truy vấn SQL:", query); // Log truy vấn SQL
    await sql.query(query);

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Route: Thêm người dùng
router.post("/", async (req, res) => {
  try {
    const { username, email, role, password } = req.body;

    // Mã hóa mật khẩu
    const passwordHash = await bcrypt.hash(password, 10);

    // Kết nối đến cơ sở dữ liệu
    await sql.connect(dbConfig);

    // Thực hiện truy vấn thêm người dùng
    const result = await sql.query(
      `INSERT INTO Users (Name, Email, role, PasswordHash) OUTPUT INSERTED.* VALUES ('${username}', '${email}', '${role}', '${passwordHash}')`
    );

    res.json(result.recordset[0]); // Trả về người dùng vừa được thêm
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ error: "Failed to add user" });
  }
});

export default router;

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
    await sql.connect(dbConfig);
    const result = await sql.query(
      "SELECT id, Name AS username, Email AS email, role, PasswordHash FROM Users WHERE role != 'admin'"
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Route: Lấy danh sách tổ chức cho volunteer (ĐẶT TRƯỚC ROUTE ĐỘNG)
router.get("/organizers", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query(`
      SELECT 
        Id AS OrganizerId,
        Name AS OrganizerName,
        Email AS OrganizerEmail
      FROM Users
      WHERE Role = 'organizer'
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch organizers" });
  }
});

// Route: Lấy danh sách volunteer cho organizer
router.get("/organizer/volunteers", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query(`
      SELECT 
        Id AS VolunteerId,
        Name AS VolunteerName,
        Email AS VolunteerEmail
      FROM Users
      WHERE Role = 'volunteer'
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch volunteers" });
  }
});

// Route: Lấy lịch sử tham gia sự kiện của volunteer (CHỈ SỰ KIỆN ĐÃ KẾT THÚC)
router.get("/:userId/registrations", async (req, res) => {
  const { userId } = req.params;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query(`
      SELECT 
        e.Id AS id,
        e.Name AS name,
        e.Date AS date
      FROM EventRegistrations r
      JOIN Events e ON r.EventId = e.Id
      WHERE r.VolunteerId = ${userId} AND e.IsFinished = 1
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

// Route: Xóa người dùng
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await sql.connect(dbConfig);
    await sql.query(`DELETE FROM Users WHERE id = ${id}`);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Route: Cập nhật người dùng
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, password } = req.body;
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;
    await sql.connect(dbConfig);
    const query = passwordHash
      ? `UPDATE Users SET Name = '${username}', Email = '${email}', role = '${role}', PasswordHash = '${passwordHash}' WHERE id = ${id}`
      : `UPDATE Users SET Name = '${username}', Email = '${email}', role = '${role}' WHERE id = ${id}`;
    await sql.query(query);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Route: Thêm người dùng
router.post("/", async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    await sql.connect(dbConfig);
    const result = await sql.query(
      `INSERT INTO Users (Name, Email, role, PasswordHash) OUTPUT INSERTED.* VALUES ('${username}', '${email}', '${role}', '${passwordHash}')`
    );
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add user" });
  }
});

export default router;

import { poolPromise } from "../db.js"; // Import poolPromise từ db.js
import sql from "mssql";
import express from "express";

const router = express.Router();

// Route: Lấy danh sách tất cả sự kiện
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Events");
    res.json(result.recordset); // Trả về danh sách sự kiện
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});
// Route: Lấy danh sách tất cả sự kiện
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Events WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching event details:", err);
    res.status(500).json({ error: "Failed to fetch event details" });
  }
});

// Route: Thêm sự kiện mới
router.post("/", async (req, res) => {
  const {
    name,
    date,
    location,
    description,
    capacity,
    status,
    image_url,
    category,
  } = req.body;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("date", sql.Date, date)
      .input("location", sql.NVarChar, location)
      .input("description", sql.NVarChar, description)
      .input("capacity", sql.Int, capacity)
      .input("status", sql.NVarChar, status || "pending")
      .input("image_url", sql.NVarChar, image_url)
      .input("category", sql.NVarChar, category)
      .input("created_at", sql.DateTime, new Date())
      .input("updated_at", sql.DateTime, new Date())
      .query(
        `INSERT INTO Events 
        (name, date, location, description, capacity, status, image_url, category, created_at, updated_at) 
        VALUES 
        (@name, @date, @location, @description, @capacity, @status, @image_url, @category, @created_at, @updated_at)`
      );
    res.status(201).json({ message: "Event added successfully" });
  } catch (err) {
    console.error("Error adding event:", err); // Log lỗi chi tiết
    res.status(500).json({ error: "Failed to add event" });
  }
});

// Route: Cập nhật sự kiện
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    date,
    location,
    description,
    capacity,
    status,
    image_url,
    category,
  } = req.body;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, name)
      .input("date", sql.Date, date)
      .input("location", sql.NVarChar, location)
      .input("description", sql.NVarChar, description)
      .input("capacity", sql.Int, capacity)
      .input("status", sql.NVarChar, status)
      .input("image_url", sql.NVarChar, image_url)
      .input("category", sql.NVarChar, category)
      .query(
        `UPDATE Events
         SET name = @name, date = @date, location = @location, description = @description,
             capacity = @capacity, status = @status, image_url = @image_url, category = @category
         WHERE id = @id`
      );

    res.json({ message: "Event updated successfully" });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Route: Xóa sự kiện
router.delete("/:id", async (req, res) => {
  const { id } = req.params; // Lấy ID từ URL
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Events WHERE id = @id");
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// Route: Đăng ký sự kiện
router.post("/:id/register", async (req, res) => {
  const { id } = req.params; // ID của sự kiện
  const { volunteerId, volunteerName, volunteerEmail } = req.body; // Thông tin volunteer

  console.log("Received Data:", { volunteerId, volunteerName, volunteerEmail }); // Log dữ liệu nhận được

  if (!volunteerId || !volunteerName || !volunteerEmail) {
    return res
      .status(400)
      .json({ error: "Thông tin tình nguyện viên không đầy đủ." });
  }

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("eventId", sql.Int, id)
      .input("volunteerId", sql.Int, volunteerId)
      .input("volunteerName", sql.NVarChar, volunteerName)
      .input("volunteerEmail", sql.NVarChar, volunteerEmail)
      .query(
        `INSERT INTO EventRegistrations (event_id, volunteer_id, volunteer_name, volunteer_email)
         VALUES (@eventId, @volunteerId, @volunteerName, @volunteerEmail)`
      );

    res.status(201).json({ message: "Đăng ký sự kiện thành công!" });
  } catch (err) {
    console.error("Error registering for event:", err);
    res.status(500).json({ error: "Failed to register for event" });
  }
});

// Route: Lấy danh sách tình nguyện viên đã đăng ký cho sự kiện
router.get("/:id/registrations", async (req, res) => {
  const { id } = req.params; // ID của sự kiện

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("eventId", sql.Int, id)
      .query(
        `SELECT volunteer_id, volunteer_name, volunteer_email, registered_at
         FROM EventRegistrations
         WHERE event_id = @eventId`
      );

    res.json(result.recordset); // Trả về danh sách tình nguyện viên đã đăng ký
  } catch (err) {
    console.error("Error fetching registrations:", err);
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

export default router;

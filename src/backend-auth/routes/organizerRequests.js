import express from "express";
import { poolPromise } from "../db.js";
import sql from "mssql";

const router = express.Router();

// Volunteer gửi yêu cầu
router.post("/", async (req, res) => {
    const { userId, name, email, message } = req.body;
    console.log("Dữ liệu nhận được:", req.body);
    try {
        const pool = await poolPromise;
        await pool
            .request()
            .input("userId", sql.Int, userId)
            .input("name", sql.NVarChar, name)
            .input("email", sql.NVarChar, email)
            .input("message", sql.NVarChar, message)
            .input("status", sql.NVarChar, "pending")
            .query(
                `INSERT INTO OrganizerRequests (user_id, name, email, message, status)
         VALUES (@userId, @name, @email, @message, @status)`
            );
        res.json({ message: "Request sent" });
    } catch (err) {
        res.status(500).json({ error: "Failed to send request" });
    }
});

// Admin lấy danh sách yêu cầu
router.get("/", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query("SELECT * FROM OrganizerRequests WHERE status = 'pending'");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching organizer requests:", err); // Log chi tiết lỗi
        res.status(500).json({ error: "Failed to fetch requests" });
    }
});

// Admin duyệt yêu cầu
router.post("/:requestId/approve", async (req, res) => {
    const { requestId } = req.params;
    try {
        const pool = await poolPromise;
        // Lấy user_id từ request
        const requestResult = await pool
            .request()
            .input("id", sql.Int, requestId)
            .query("SELECT user_id FROM OrganizerRequests WHERE id = @id");
        const userId = requestResult.recordset[0]?.user_id;
        if (!userId) return res.status(404).json({ error: "Request not found" });

        // Cập nhật role user
        await pool
            .request()
            .input("userId", sql.Int, userId)
            .query("UPDATE Users SET Role = 'organizer' WHERE Id = @userId");

        // Cập nhật trạng thái request
        await pool
            .request()
            .input("id", sql.Int, requestId)
            .query("UPDATE OrganizerRequests SET status = 'approved' WHERE id = @id");

        res.json({ message: "User promoted to organizer" });
    } catch (err) {
        res.status(500).json({ error: "Failed to approve request" });
    }
});
router.delete("/:requestId", async (req, res) => {
    const { requestId } = req.params;
    try {
        const pool = await poolPromise;
        await pool
            .request()
            .input("id", sql.Int, requestId)
            .query("DELETE FROM OrganizerRequests WHERE id = @id");
        res.json({ message: "Request deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete request" });
    }
});

export default router;

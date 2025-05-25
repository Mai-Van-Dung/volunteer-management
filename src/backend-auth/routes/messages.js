import express from "express";
import sql from "mssql";
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

// Lấy tất cả tin nhắn giữa 2 user (cả 2 chiều)
router.get("/:userA/:userB", async (req, res) => {
  const { userA, userB } = req.params;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query(`
      SELECT 
        m.Id,
        m.SenderId,
        m.ReceiverId,
        m.Content,
        m.CreatedAt,
        sender.Name AS SenderName,
        receiver.Name AS ReceiverName
      FROM Messages m
      JOIN Users sender ON m.SenderId = sender.Id
      JOIN Users receiver ON m.ReceiverId = receiver.Id
      WHERE (m.SenderId = ${userA} AND m.ReceiverId = ${userB})
         OR (m.SenderId = ${userB} AND m.ReceiverId = ${userA})
      ORDER BY m.CreatedAt ASC
    `);
    const messages = result.recordset.map(m => ({
      id: m.Id,
      senderId: m.SenderId,
      receiverId: m.ReceiverId,
      content: m.Content,
      createdAt: m.CreatedAt,
      senderName: m.SenderName,
      receiverName: m.ReceiverName
    }));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Thêm tin nhắn mới
router.post("/", async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  try {
    await sql.connect(dbConfig);
    await sql.query(`
      INSERT INTO Messages (SenderId, ReceiverId, Content, CreatedAt)
      VALUES (${senderId}, ${receiverId}, N'${content}', GETDATE())
    `);
    res.json({ message: "Message sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
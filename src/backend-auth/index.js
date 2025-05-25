import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import eventsRouter from "./routes/events.js";
import messagesRouter from "./routes/messages.js";
import { API_BASE_URL } from "../config.js";
import organizerRequestsRouter from "./routes/organizerRequests.js"; // Đã thêm dòng này

dotenv.config();

const app = express();
const server = http.createServer(app);

// Lấy origin từ API_BASE_URL (bỏ :5000, thay bằng :5173)
const frontendOrigin = API_BASE_URL.replace(/:5000$/, ":5173");

// Thêm cả localhost và IP LAN vào danh sách origin
const allowedOrigins = [
  "http://localhost:5173",
  frontendOrigin,
  "http://192.168.1.13:5173",
];

// Socket.io: dùng hàm kiểm tra động cho origin để tránh lỗi CORS khi nhiều origin khác nhau
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS (socket.io)"));
      }
    },
    methods: ["GET", "POST"],
  },
});

// CORS cho REST API
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/messages", messagesRouter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventsRouter);
app.use("/api/organizer-requests", organizerRequestsRouter); // Thêm dòng này để khai báo route

// Socket.io xử lý realtime
io.on("connection", (socket) => {
  socket.on("sendMessage", (msg) => {
    io.emit("newMessage", msg);
  });
});

const PORT = 5000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on http://0.0.0.0:${PORT}`)
);

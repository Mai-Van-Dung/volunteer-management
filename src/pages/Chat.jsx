import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const socket = io(API_BASE_URL);

const Chat = ({ user }) => {
    const { volunteerId, organizerId } = useParams();
    // Xác định người nhận dựa vào role
    const receiverId = user.role === "organizer" ? volunteerId : organizerId;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    // Lấy lịch sử tin nhắn từ DB khi vào phòng chat
    useEffect(() => {
        if (user.id && receiverId) {
            axios
                .get(`${API_BASE_URL}/api/messages/${user.id}/${receiverId}`)
                .then(res => {
                    setMessages(
                        res.data.map(m => ({
                            ...m,
                            createdAt: m.createdAt || m.CreatedAt,
                            content: m.content || m.Content
                        }))
                    );
                    scrollToBottom();
                });
        }
        // eslint-disable-next-line
    }, [user.id, receiverId]);

    // Lắng nghe tin nhắn mới qua socket
    useEffect(() => {
        const handleNewMessage = (msg) => {
            if (
                (msg.senderId == user.id && msg.receiverId == receiverId) ||
                (msg.senderId == receiverId && msg.receiverId == user.id)
            ) {
                setMessages(prev => [...prev, msg]);
                scrollToBottom();
            }
        };
        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
        // eslint-disable-next-line
    }, [user.id, receiverId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const msg = {
            senderId: user.id,
            receiverId,
            senderRole: user.role,
            senderName: user.name,
            content: input,
            createdAt: new Date().toISOString(),
        };
        socket.emit("sendMessage", msg);
        setInput("");
        // Lưu vào DB
        await axios.post(`${API_BASE_URL}/api/messages`, msg);
    };

    const otherName = messages.length > 0
        ? (messages[0].senderId == user.id ? messages[0].receiverName : messages[0].senderName)
        : "Đối phương";

    return (
        <div className="max-w-2xl mx-auto bg-white rounded shadow p-6 mt-8">
            <h2 className="text-xl font-bold mb-4 text-center">{otherName}</h2>
            <div className="h-80 overflow-y-auto border p-4 mb-4 bg-gray-50 rounded">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`mb-2 flex ${msg.senderId == user.id ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`rounded px-3 py-2 max-w-xs break-words
                                ${msg.senderId == user.id
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-800"}`}
                        >
                            <div className="text-xs font-semibold mb-1">
                                {msg.senderId == user.id ? "Bạn" : msg.senderName}
                            </div>
                            <div>{msg.content || "[Không có nội dung]"}</div>
                            <div className="text-[10px] text-right text-gray-300 mt-1">
                                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex">
                <input
                    className="flex-1 border rounded px-3 py-2 mr-2"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={handleSend}
                >
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default Chat;
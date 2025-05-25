import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ApplyOrganizer = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/organizer-requests", {
                userId: user.id,
                name: user.name,
                email: user.email,
                message,
            });
            setStatus("Yêu cầu của bạn đã được gửi tới admin!");
        } catch (err) {
            setStatus("Gửi yêu cầu thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="m-auto bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Đăng ký làm Organizer</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Lý do bạn muốn trở thành Organizer</label>
                        <textarea
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Gửi yêu cầu
                    </button>
                </form>
                {status && <p className="mt-4 text-center text-green-600">{status}</p>}
            </div>
        </div>
    );
};

export default ApplyOrganizer;
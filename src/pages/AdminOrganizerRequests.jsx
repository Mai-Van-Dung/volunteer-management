import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrganizerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Lấy danh sách yêu cầu khi load trang
    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/api/organizer-requests");
            setRequests(res.data);
        } catch (err) {
            setMessage("Không thể tải danh sách yêu cầu.");
            console.error(err);
        }
        setLoading(false);
    };

    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/organizer-requests/${id}/approve`);
            setMessage("Đã duyệt yêu cầu thành công!");
            fetchRequests(); // Refresh danh sách
        } catch (err) {
            setMessage("Duyệt yêu cầu thất bại.");
        }
    };
    const handleReject = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa yêu cầu này?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/organizer-requests/${id}`);
            setMessage("Đã xóa yêu cầu.");
            fetchRequests();
        } catch (err) {
            setMessage("Xóa yêu cầu thất bại.");
        }
    };
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Yêu cầu đăng ký Organizer</h2>
            {message && <div className="mb-4 text-blue-600">{message}</div>}
            {loading ? (
                <div>Đang tải...</div>
            ) : requests.length === 0 ? (
                <div>Không có yêu cầu nào.</div>
            ) : (
                <table className="min-w-full border">
                    <thead>
                        <tr>
                            <th className="border px-2 py-1">Tên</th>
                            <th className="border px-2 py-1">Email</th>
                            <th className="border px-2 py-1">Lý do</th>
                            <th className="border px-2 py-1">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req.id}>
                                <td className="border px-2 py-1">{req.name}</td>
                                <td className="border px-2 py-1">{req.email}</td>
                                <td className="border px-2 py-1">{req.message}</td>
                                <td className="border px-2 py-1 flex gap-2">
                                    <button
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                        onClick={() => handleApprove(req.id)}
                                    >
                                        Duyệt
                                    </button>
                                    <button
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                        onClick={() => handleReject(req.id)}
                                    >
                                        Không duyệt
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminOrganizerRequests;
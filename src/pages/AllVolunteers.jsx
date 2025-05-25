import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const AllVolunteers = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/users/organizer/volunteers`)
            .then(res => setVolunteers(res.data))
            .catch(() => setVolunteers([]));
    }, []);

    const filtered = volunteers.filter(
        v =>
            v.VolunteerName.toLowerCase().includes(search.toLowerCase()) ||
            v.VolunteerEmail.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-4 text-blue-700">Quản lý tình nguyện viên</h1>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="mb-4 px-4 py-2 border rounded w-full"
                />
                <table className="min-w-full border">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="py-2 px-4 border">STT</th>
                            <th className="py-2 px-4 border">Tên</th>
                            <th className="py-2 px-4 border">Email</th>
                            <th className="py-2 px-4 border">Số sự kiện đã tham gia</th>
                            <th className="py-2 px-4 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map((v, idx) => (
                                <tr key={v.VolunteerId}>
                                    <td className="py-2 px-4 border">{idx + 1}</td>
                                    <td className="py-2 px-4 border">{v.VolunteerName}</td>
                                    <td className="py-2 px-4 border">{v.VolunteerEmail}</td>
                                    <td className="py-2 px-4 border">{v.EventCount}</td>
                                    <td className="py-2 px-4 border">
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => navigate(`/organizer/messages/${v.VolunteerId}`)}
                                        >
                                            Nhắn tin
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500">
                                    Không có tình nguyện viên nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllVolunteers;
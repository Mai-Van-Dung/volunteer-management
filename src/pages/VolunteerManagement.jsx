import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VolunteerManagement = () => {
  const { id } = useParams(); // Lấy ID sự kiện từ URL
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}/registrations`);
        setRegistrations(res.data); // Lưu danh sách tình nguyện viên vào state
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách tình nguyện viên:", err);
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [id]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Đang tải danh sách...</div>;
  }

  if (registrations.length === 0) {
    return <div className="flex h-screen items-center justify-center">Không có tình nguyện viên nào đăng ký.</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Danh sách tình nguyện viên đã đăng ký</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Tên</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Thời gian đăng ký</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg) => (
            <tr key={reg.volunteer_id}>
              <td className="border border-gray-300 px-4 py-2">{reg.volunteer_name}</td>
              <td className="border border-gray-300 px-4 py-2">{reg.volunteer_email}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(reg.registered_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VolunteerManagement;
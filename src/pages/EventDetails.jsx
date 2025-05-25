import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import formatDateTime from "../utils/formatDateTime";
import { API_BASE_URL } from "../config";

const EventDetails = () => {
  const { id } = useParams(); // Lấy ID sự kiện từ URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy vai trò người dùng từ localStorage
  const userRole = JSON.parse(localStorage.getItem("user"))?.role;

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/events/${id}`);
        // Map lại dữ liệu từ PascalCase sang camelCase
        const e = res.data;
        setEvent({
          id: e.Id,
          name: e.Name,
          date: e.Date,
          location: e.Location,
          description: e.Description,
          capacity: e.Capacity,
          status: e.Status,
          image_url: e.Image_Url,
          category: e.Category,
          created_at: e.Created_At,
          updated_at: e.Updated_At,
        });
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết sự kiện:", err);
        alert("Không thể tải chi tiết sự kiện. Vui lòng thử lại.");
        navigate(userRole === "volunteer" ? "/volunteer-dashboard" : "/organizer-dashboard");
      }
    };

    fetchEventDetails();
  }, [id, navigate, userRole]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Đang tải chi tiết sự kiện...</div>;
  }

  if (!event) {
    return <div className="flex h-screen items-center justify-center">Không tìm thấy sự kiện.</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="m-auto bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">{event.name}</h1>
        <p><strong>Ngày:</strong> {formatDateTime(event.date)}</p>
        <p><strong>Địa điểm:</strong> {event.location}</p>
        <p><strong>Mô tả:</strong> {event.description}</p>
        <p><strong>Số lượng:</strong> {event.capacity}</p>
        <p><strong>Trạng thái:</strong> {event.status}</p>
        <p><strong>Loại:</strong> {event.category}</p>
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.name}
            className="w-full h-40 object-cover rounded mt-4"
          />
        )}
        <button
          onClick={() => navigate(userRole === "volunteer" ? "/volunteer-dashboard" : "/organizer-dashboard")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
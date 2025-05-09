import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiPlus, FiTrash2, FiEye, FiEdit } from "react-icons/fi";
const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [events, setEvents] = useState([]);

  // Fetch events from the backend
  useEffect(() => {
    if (!user || user.role !== "organizer") {
      alert("Bạn không có quyền truy cập vào trang này!");
      navigate("/login");
    }
  
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events");
        console.log("Fetched events:", res.data); // Log dữ liệu từ API
        setEvents(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách sự kiện:", err);
      }
    };
  
    fetchEvents();
  }, [user, navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Handle delete event
  const handleDeleteEvent = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`);
        setEvents(events.filter((event) => event.id !== id));
        alert("Xóa sự kiện thành công!");
      } catch (err) {
        console.error("Lỗi khi xóa sự kiện:", err);
        alert("Không thể xóa sự kiện. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar role="organizer" onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Chào mừng, {user?.name}
          </h1>
          <p className="text-gray-600 mb-6">
            Đây là bảng điều khiển dành cho tổ chức. Bạn có thể quản lý sự kiện và tình nguyện viên.
          </p>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-blue-700">Danh sách sự kiện</h2>
            <button
              onClick={() => navigate("/organizer/add-event")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            >
              <FiPlus className="mr-2" />
              Thêm sự kiện mới
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">No</th>
                  <th className="py-3 px-4 text-left">Tên sự kiện</th>
                  <th className="py-3 px-4 text-left">Ngày</th>
                  <th className="py-3 px-4 text-left">Địa điểm</th>
                  <th className="py-3 px-4 text-left">Mô tả</th>
                  <th className="py-3 px-4 text-left">Số lượng</th>
                  <th className="py-3 px-4 text-left">Trạng thái</th>
                  <th className="py-3 px-4 text-left">Hình ảnh</th>
                  <th className="py-3 px-4 text-left">Loại</th>
                  <th className="py-3 px-4 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((event, index) => (
                    <tr
                      key={event.id}
                      className={`border-t ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100`}
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{event.name}</td>
                      <td className="py-3 px-4">{event.date}</td>
                      <td className="py-3 px-4">{event.location}</td>
                      <td className="py-3 px-4">{event.description}</td>
                      <td className="py-3 px-4">{event.capacity}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded ${
                            event.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : event.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {event.image_url ? (
                          <img
                            src={event.image_url}
                            alt={event.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          "Không có"
                        )}
                      </td>
                      <td className="py-3 px-4">{event.category}</td>
                      <td className="py-3 px-4 flex space-x-2">
                      <button
                      onClick={() => navigate(`/organizer/events/${event.id}`)}
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <FiEye className="mr-1" />
                      Xem
                    </button>
                    <button
  onClick={() => navigate(`/organizer/events/edit/${event.id}`)}
  className="text-green-600 hover:underline flex items-center"
>
  <FiEdit className="mr-1" />
  Chỉnh sửa
</button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 hover:underline flex items-center"
                        >
                          <FiTrash2 className="mr-1" />
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="10"
                      className="py-3 px-4 text-center text-gray-600"
                    >
                      Không có sự kiện nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizerDashboard;
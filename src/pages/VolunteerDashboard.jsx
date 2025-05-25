import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import formatDateTime from "../utils/formatDateTime";
import { API_BASE_URL } from "../config";

const VolunteerDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showNotice, setShowNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");

  useEffect(() => {
    if (!user || user.role !== "volunteer") {
      alert("Bạn không có quyền truy cập vào trang này!");
      navigate("/login");
    }

    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/events`);
        const mappedEvents = res.data.map(e => ({
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
          isFinished: e.IsFinished, // Thêm trường này để kiểm tra sự kiện đã kết thúc
        }));
        setEvents(mappedEvents);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách sự kiện:", err);
      }
    };

    fetchEvents();
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleRegister = async (eventId) => {
    const volunteer = JSON.parse(localStorage.getItem("user"));
    if (!volunteer || !volunteer.email) {
      setNoticeMessage("Thông tin tình nguyện viên không hợp lệ. Vui lòng đăng nhập lại.");
      setShowNotice(true);
      return;
    }

    // Kiểm tra sự kiện đã kết thúc chưa
    const event = events.find(e => e.id === eventId);
    if (event && event.isFinished) {
      setNoticeMessage("Sự kiện này đã kết thúc. Bạn không thể đăng ký.");
      setShowNotice(true);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/events/${eventId}/register`, {
        volunteerId: volunteer.id,
        volunteerName: volunteer.name,
        volunteerEmail: volunteer.email,
      });
      setNoticeMessage("Đăng ký sự kiện thành công!");
      setShowNotice(true);
    } catch (err) {
      setNoticeMessage(
        err.response?.data?.message ||
        "Không thể đăng ký sự kiện. Vui lòng thử lại."
      );
      setShowNotice(true);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      (!selectedCategory || (event.category && event.category.toLowerCase() === selectedCategory.toLowerCase())) &&
      (!search || event.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar role="volunteer" onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Danh sách sự kiện</h1>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện theo tên, địa điểm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Events List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-semibold mb-2">{event.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Địa điểm:</strong> {event.location}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Thời gian:</strong> {formatDateTime(event.date)}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Mô tả:</strong> {event.description || "Không có mô tả"}
                  </p>
                  <button
                    onClick={() => handleRegister(event.id)}
                    className={`px-4 py-2 rounded text-white ${event.isFinished ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                    disabled={event.isFinished}
                  >
                    {event.isFinished ? "Đã kết thúc" : "Đăng ký"}
                  </button>
                  <button
                    onClick={() => navigate(`/volunteer/events/${event.id}`)}
                    className="text-blue-600 hover:underline flex items-center ml-2"
                  >
                    Xem
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600 col-span-full text-center">
                Không tìm thấy sự kiện nào phù hợp.
              </p>
            )}
            {showNotice && (
              <div className="flex items-center justify-center z-50 absolute top-10 left-1/2 transform -translate-x-1/2">
                <div className="bg-white rounded-lg p-6 w-full max-w-xs shadow-lg text-center border border-blue-200">
                  <h2 className="text-lg font-bold mb-2">Thông báo</h2>
                  <p>{noticeMessage}</p>
                  <button
                    onClick={() => setShowNotice(false)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VolunteerDashboard;
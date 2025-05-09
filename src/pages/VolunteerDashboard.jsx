import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VolunteerDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); // Đổi tên state từ activities thành events
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user || user.role !== "volunteer") {
      alert("Bạn không có quyền truy cập vào trang này!");
      navigate("/login");
    }

    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events"); // Gọi API lấy danh sách sự kiện
        setEvents(res.data); 
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
      alert("Thông tin tình nguyện viên không hợp lệ. Vui lòng đăng nhập lại.");
      return;
    }
  
    console.log("Volunteer Info:", volunteer); // Log thông tin volunteer để kiểm tra
  
    try {
      await axios.post(`http://localhost:5000/api/events/${eventId}/register`, {
        volunteerId: volunteer.id,
        volunteerName: volunteer.name,
        volunteerEmail: volunteer.email,
      });
      alert("Đăng ký sự kiện thành công!");
    } catch (err) {
      console.error("Lỗi khi đăng ký sự kiện:", err);
      alert("Không thể đăng ký sự kiện. Vui lòng thử lại.");
    }
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(search.toLowerCase()) ||
    event.location.toLowerCase().includes(search.toLowerCase()) ||
    event.description?.toLowerCase().includes(search.toLowerCase())
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
                    <strong>Thời gian:</strong> {event.date}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Mô tả:</strong> {event.description || "Không có mô tả"}
                  </p>
                  <button
                  onClick={() => handleRegister(event.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Đăng ký
                </button>
                  <button
                  onClick={() => navigate(`/volunteer/events/${event.id}`)}
                  className="text-blue-600 hover:underline flex items-center"
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default VolunteerDashboard;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiSettings, FiLogOut, FiBarChart2, FiBell, FiCheckCircle, FiClipboard } from "react-icons/fi";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      alert("Bạn không phải admin!");
      navigate("/login");
    }

    // Fetch total users
    const fetchTotalUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        setTotalUsers(res.data.length);
      } catch (err) {
        console.error("Lỗi khi lấy tổng số người dùng:", err);
      }
    };

    fetchTotalUsers();
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between">
        <div>
          <div className="p-6 text-2xl font-bold border-b border-gray-700">
            Admin Panel
          </div>
          <nav className="p-4 space-y-4">
            {/* Quản lý tài khoản */}
            <div
              className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
              onClick={() => navigate("/admin/user-management")}
            >
              <FiUsers className="mr-3" />
              <span>Quản lý tài khoản</span>
            </div>

            {/* Quản lý hoạt động tình nguyện */}
            <div
              className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
              onClick={() => navigate("/admin/volunteer-activities")}
            >
              <FiClipboard className="mr-3" />
              <span>Quản lý hoạt động</span>
            </div>

            {/* Xác nhận giờ đặc biệt */}
            <div
              className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
              onClick={() => navigate("/admin/confirm-special-hours")}
            >
              <FiCheckCircle className="mr-3" />
              <span>Xác nhận giờ đặc biệt</span>
            </div>

            {/* Thống kê và báo cáo */}
            <div
              className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
              onClick={() => navigate("/admin/statistics")}
            >
              <FiBarChart2 className="mr-3" />
              <span>Thống kê & Báo cáo</span>
            </div>

            {/* Gửi thông báo */}
            <div
              className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
              onClick={() => navigate("/admin/notifications")}
            >
              <FiBell className="mr-3" />
              <span>Gửi thông báo</span>
            </div>

            {/* Cài đặt hệ thống */}
            <div
              className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
              onClick={() => navigate("/admin/settings")}
            >
              <FiSettings className="mr-3" />
              <span>Cài đặt hệ thống</span>
            </div>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center text-red-400 hover:text-red-600"
          >
            <FiLogOut className="mr-2" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Chào mừng, {user?.name}
          </h1>
          <p className="text-gray-600 mb-6">
            Đây là bảng điều khiển quản trị viên. Bạn có thể quản lý người dùng, hoạt động tình nguyện, và cài đặt hệ thống.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tổng số người dùng */}
            <div className="p-6 bg-blue-500 text-white rounded-lg shadow hover:shadow-lg transition">
              <h2 className="font-semibold text-lg">Tổng số người dùng</h2>
              <p className="text-4xl mt-2 font-bold">{totalUsers}</p>
            </div>

            {/* Vai trò phân quyền */}
            <div className="p-6 bg-green-500 text-white rounded-lg shadow hover:shadow-lg transition">
              <h2 className="font-semibold text-lg">Vai trò phân quyền</h2>
              <p className="text-sm mt-2">Admin / Volunteer / Organizer</p>
            </div>

            {/* Cài đặt hệ thống */}
            <div className="p-6 bg-yellow-500 text-white rounded-lg shadow hover:shadow-lg transition">
              <h2 className="font-semibold text-lg">Cài đặt hệ thống</h2>
              <p className="text-sm mt-2">Bảo mật, cấu hình hệ thống</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
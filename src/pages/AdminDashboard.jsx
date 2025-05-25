import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiSettings, FiLogOut, FiBarChart2, FiBell, FiCheckCircle, FiClipboard } from "react-icons/fi";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Sidebar from "../components/Sidebar";

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
        const res = await axios.get(`${API_BASE_URL}/api/users`);
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
      <Sidebar role="admin" onLogout={handleLogout} />
    

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
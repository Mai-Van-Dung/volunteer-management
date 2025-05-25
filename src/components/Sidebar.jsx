import React from "react";
import { FiLogOut, FiList, FiClock, FiMessageCircle, FiCalendar, FiUsers, FiCheckCircle, FiBarChart2, FiBell, FiClipboard, FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ role, onLogout }) => {
  const navigate = useNavigate();

  // Cấu hình sidebar dựa trên vai trò
  const menuItems = {
    admin: [
      { label: "Quản lý tài khoản", icon: <FiUsers />, path: "/admin/user-management" },
      { label: "Quản lý hoạt động", icon: <FiClipboard />, path: "/admin/volunteer-activities" },
      { label: "Xác nhận giờ đặc biệt", icon: <FiCheckCircle />, path: "/admin/confirm-special-hours" },
      { label: "Thống kê & Báo cáo", icon: <FiBarChart2 />, path: "/admin/statistics" },
      { label: "Gửi thông báo", icon: <FiBell />, path: "/admin/notifications" },
      { label: "Cài đặt hệ thống", icon: <FiSettings />, path: "/admin/settings" },
    ],
    volunteer: [
      { label: "Danh sách hoạt động", icon: <FiList />, path: "/volunteer/activities" },
      { label: "Lịch sử tham gia", icon: <FiClock />, path: "/volunteer/history" },
      { label: "Trò chuyện với tổ chức", icon: <FiMessageCircle />, path: "/chat" },
    ],
    organizer: [
      { label: "Quản lý sự kiện", icon: <FiCalendar />, path: "/organizer/events" },
      { label: "Quản lý tình nguyện viên", icon: <FiUsers />, path: "/organizer/volunteers" },
      { label: "Xác nhận giờ phục vụ", icon: <FiCheckCircle />, path: "/organizer/verify-hours" },
      { label: "Trò chuyện với tình nguyện viên", icon: <FiMessageCircle />, path: "/organizer/messages" },
    ],
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between">
      <div>
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          {role === "admin"
            ? "Admin Panel"
            : role === "volunteer"
              ? "Volunteer Panel"
              : "Organizer Panel"}
        </div>
        <nav className="p-4 space-y-4">
          {menuItems[role]?.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="flex items-center text-red-400 hover:text-red-600"
        >
          <FiLogOut className="mr-2" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
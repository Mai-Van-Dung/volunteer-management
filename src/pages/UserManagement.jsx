import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // Sử dụng Sidebar component
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "volunteer", // Giá trị mặc định là "volunteer"
    password: "",
  });
  const navigate = useNavigate();

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle delete user
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
        alert("Xóa người dùng thành công!");
      } catch (err) {
        console.error("Lỗi khi xóa người dùng:", err);
        alert("Không thể xóa người dùng.");
      }
    }
  };

  // Handle edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: "", // Mật khẩu sẽ được nhập mới khi chỉnh sửa
    });
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle save edited user
  const handleSave = async () => {
    try {
      console.log("Dữ liệu gửi lên API:", formData); // Log dữ liệu gửi lên
      await axios.put(`http://localhost:5000/api/users/${editingUser.id}`, formData);
      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? { ...user, ...formData, password: undefined } // Không lưu mật khẩu trong danh sách người dùng
            : user
        )
      );
      setEditingUser(null);
      alert("Cập nhật người dùng thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật người dùng:", err);
      alert("Không thể cập nhật người dùng.");
    }
  };

  // Handle add new user
  const handleAdd = async () => {
    try {
      console.log("Dữ liệu gửi lên API:", formData); // Log dữ liệu gửi lên
      const res = await axios.post("http://localhost:5000/api/users", formData);
      setUsers([...users, res.data]); // Thêm người dùng mới vào danh sách
      setEditingUser(null); // Đóng form
      alert("Thêm người dùng thành công!");
    } catch (err) {
      console.error("Lỗi khi thêm người dùng:", err);
      alert("Không thể thêm người dùng.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar role="admin" onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-700">Danh sách người dùng</h2>
            <button
              onClick={() => {
                setEditingUser({});
                setFormData({ username: "", email: "", role: "volunteer", password: "" }); // Đặt giá trị mặc định cho role
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Thêm Người Dùng
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">No</th>
                  <th className="py-3 px-4 text-left">Username</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.role}</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:underline"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:underline"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Form */}
        {editingUser && (
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingUser.id ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="volunteer">Volunteer</option>
                  <option value="organizer">Organizer</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={editingUser.id ? handleSave : handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingUser.id ? "Lưu" : "Thêm"}
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;
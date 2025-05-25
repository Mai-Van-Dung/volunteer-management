import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/image75.png";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { API_BASE_URL } from "../config";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      // Log dữ liệu trả về và trạng thái response
      console.log("Dữ liệu trả về từ API:", data);
  

      // Kiểm tra data.user và data.user.role tồn tại trước khi truy cập
      if (response.ok && data.user && data.user.role) {
        const userObj = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role
        };
        localStorage.setItem("user", JSON.stringify(userObj));
        localStorage.setItem("token", data.token);
        setUser && setUser(userObj); // Cập nhật state user ở App.jsx
        setSuccess("Đăng nhập thành công!");

        // Điều hướng dựa vào role
        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (data.user.role === "volunteer") {
          navigate("/volunteer-dashboard");
        } else if (data.user.role === "organizer") {
          navigate("/organizer-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi đăng nhập:", err.message);
      alert("Lỗi: " + err.message); 
      setError("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-8">
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p className="mb-6 text-sm text-gray-600">
          Enter your credentials to access your account
        </p>
        <form className="w-full max-w-sm" onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
          <div className="my-4 w-full max-w-sm flex items-center justify-center">
            <div className="border-t border-gray-300 flex-grow mr-3" />
            <span className="text-sm text-gray-500">or</span>
            <div className="border-t border-gray-300 flex-grow ml-3" />
          </div>
          <div className="flex space-x-4 w-full max-w-sm">
            <button type="button" className="flex items-center justify-center w-1/2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100">
              <FcGoogle className="mr-2 text-xl" /> Sign in with Google
            </button>
            <button type="button" className="flex items-center justify-center w-1/2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100">
              <FaApple className="mr-2 text-xl" /> Sign in with Apple
            </button>
          </div>
        </form>
        <p className="text-sm mt-6">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
      </div>
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          height: "100vh",
          width: "50%",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}
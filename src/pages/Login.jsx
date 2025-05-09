import { useState } from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/image75.png";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
export default function Login() {
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
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
    
        const data = await response.json();
        console.log("Dữ liệu trả về từ API:", data); // Log dữ liệu trả về
    
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
    
        // Lưu token + thông tin user
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
    
        setSuccess("Login successful!");
    
        // Điều hướng dựa vào role
        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (data.user.role === "volunteer") {
          navigate("/volunteer-dashboard");
        } else if (data.user.role === "organizer") {
          navigate("/organizer-dashboard");
        } else {
          navigate("/"); // fallback
        }
      } catch (err) {
        console.error("Lỗi khi đăng nhập:", err.message); // Log lỗi
        setError(err.message);
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
                    <button className="flex items-center justify-center w-1/2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100">
                      <FcGoogle className="mr-2 text-xl" /> Sign in with Google
                    </button>
                    <button className="flex items-center justify-center w-1/2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100">
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
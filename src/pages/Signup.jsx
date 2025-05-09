import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import bgImage from "../assets/image75.png";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Add navigate for redirection
  
    const handleSignup = async (e) => {
      e.preventDefault();
      setError("");
  
      try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }
  
        alert("Signup successful! Redirecting to login...");
        navigate("/login"); // Redirect to login page
      } catch (err) {
        setError(err.message);
      }
    };

  return (
    <div className="flex h-screen">
      {/* Left form area */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-8">
        <h2 className="text-2xl font-bold mb-2">Get Started Now</h2>
        <form className="w-full max-w-sm" onSubmit={handleSignup}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>

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

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox" required />
              <span className="ml-2 text-sm text-gray-700">
                I agree to the <a href="#" className="text-blue-600 hover:underline">terms & policy</a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Signup
          </button>
        </form>

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

        <p className="text-sm mt-6">
          Have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>

      {/* Right image area */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
    </div>
  );
};

export default Signup;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", formData);

      // Centralized Auth: This updates the Context and LocalStorage
      login(res.data.user, res.data.token);

      alert("Login Successful 😈");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error?.message || "Login Failed 💀");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl w-[350px]">
        <h1 className="text-white text-3xl font-bold mb-6">RoomRota 😈</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-4 outline-none border border-transparent focus:border-violet-500"
          />

          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-4 outline-none border border-transparent focus:border-violet-500"
          />

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-bold transition-colors"
          >
            Login
          </button>
        </form>

        <p className="text-gray-400 mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-violet-400 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
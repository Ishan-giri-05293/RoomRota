import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", formData);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6 selection:bg-protocol-blue/10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[32px] w-full max-w-[400px] shadow-soft-smoke border border-border-subtle"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-protocol-blue/5 flex items-center justify-center text-protocol-blue mb-4">
            <Home size={24} />
          </div>
          <h1 className="text-2xl font-medium text-ink-primary tracking-tight">Welcome back</h1>
          <p className="text-ink-secondary text-sm mt-2">Enter your house to continue.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-4 rounded-2xl bg-canvas border border-border-subtle text-ink-primary outline-none focus:border-protocol-blue/30 transition-all text-sm"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full p-4 rounded-2xl bg-canvas border border-border-subtle text-ink-primary outline-none focus:border-protocol-blue/30 transition-all text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-medium px-1">{error}</p>}

          <button
            type="submit"
            className="w-full bg-protocol-blue text-white py-4 rounded-full font-medium transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Log in
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-ink-secondary mt-8 text-center text-sm">
          New here?{" "}
          <Link to="/signup" className="text-protocol-blue font-medium hover:underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
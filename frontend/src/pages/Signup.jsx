import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import API from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/signup", formData);
      // Redirect to ONBOARDING to start the house creation flow
      navigate("/onboarding");
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[32px] w-full max-w-[400px] shadow-soft-smoke border border-border-subtle"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-protocol-blue/5 flex items-center justify-center text-protocol-blue mb-4">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-medium text-ink-primary tracking-tight">Create your space</h1>
          <p className="text-ink-secondary text-sm mt-2">Join 5,000+ households living in harmony.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl bg-canvas border border-border-subtle text-ink-primary outline-none focus:border-protocol-blue/30 transition-all text-sm"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl bg-canvas border border-border-subtle text-ink-primary outline-none focus:border-protocol-blue/30 transition-all text-sm"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl bg-canvas border border-border-subtle text-ink-primary outline-none focus:border-protocol-blue/30 transition-all text-sm"
          />

          {error && <p className="text-red-500 text-xs font-medium px-1">{error}</p>}

          <button
            type="submit"
            className="w-full bg-protocol-blue text-white py-4 rounded-full font-medium transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Get Started
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-ink-secondary mt-8 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-protocol-blue font-medium hover:underline underline-offset-4">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
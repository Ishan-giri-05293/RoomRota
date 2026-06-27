import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/auth/signup",
        formData
      );

      console.log(res.data);

      alert("Signup Successful 😈");

      navigate("/");
    } catch (err) {
      console.log(err);

      alert("Signup Failed 💀");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl w-[350px]">

        <h1 className="text-white text-3xl font-bold mb-6">
          Create Account 🚀
        </h1>

        <form onSubmit={handleSignup}>

          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-4 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-4 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-4 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-bold"
          >
            Signup
          </button>

        </form>

        <p className="text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-violet-400">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
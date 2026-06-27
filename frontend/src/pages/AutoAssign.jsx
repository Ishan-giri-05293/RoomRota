import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { choreService } from "../services/choreService";

export default function AutoAssign() {
  const [title, setTitle] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAutoAssign = async () => {
    if (!title.trim()) return alert("Enter a chore title");
    if (!user?.flatId) return alert("You are not in a flat! 💀");

    try {
      const res = await choreService.autoAssign({
        title,
        flatId: user.flatId,
        difficulty: "medium",
        dueDate: null,
      });

      alert(`Smart Assigned to: 😈 ${res.assignee.name}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error?.message || "AI Assignment Failed 💀");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl w-[350px] border border-zinc-800">
        <h1 className="text-white text-3xl font-bold mb-6 text-center">Smart Assign 🤖</h1>
        <p className="text-gray-400 text-sm mb-4 text-center">
          Our algorithm will pick the best person based on workload and history.
        </p>
        <input
          type="text"
          placeholder="Chore Title (e.g. Kitchen)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-4 outline-none border border-transparent focus:border-violet-500"
        />
        <button
          onClick={handleAutoAssign}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-colors"
        >
          Run AI Distribution
        </button>
      </div>
    </div>
  );
}
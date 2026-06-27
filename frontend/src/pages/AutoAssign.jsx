import { useState } from "react";
import API from "../services/api";

export default function AutoAssign() {

  const [title, setTitle] = useState("");

  const handleAutoAssign = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await API.post(
        "/chore/auto-assign",
        {
          title,
          flatId: user.flatId,
          difficulty: "medium",
          dueDate: null,
        }
      );

      console.log(res.data);

      alert(
        `Assigned to 😈 ${res.data.assignedTo}`
      );

      setTitle("");

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Failed 💀"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-8 rounded-2xl w-[350px]">

        <h1 className="text-white text-3xl font-bold mb-6">
          Smart Assign 🤖
        </h1>

        <input
          type="text"
          placeholder="Chore Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-4 outline-none"
        />

        <button
          onClick={handleAutoAssign}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-bold"
        >
          Auto Assign
        </button>

      </div>

    </div>
  );
}
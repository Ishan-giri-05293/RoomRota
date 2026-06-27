import { useState } from "react";
import API from "../services/api";

export default function AddChore() {

  const [title, setTitle] = useState("");

  const handleAddChore = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await API.post("/chore/add", {
        title,
        flatId: user.flatId,
        assignedTo: null,
        difficulty: "easy",
        dueDate: null,
      });

      console.log(res.data);

      alert("Chore Added 😈");

      setTitle("");

    } catch (err) {

      console.log(err);

      console.log(err.response?.data);

      alert(
        err.response?.data?.error ||
        "Failed 💀"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-8 rounded-2xl w-[350px]">

        <h1 className="text-white text-3xl font-bold mb-6">
          Add Chore 🧹
        </h1>

        <input
          type="text"
          placeholder="Chore Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-4 outline-none"
        />

        <button
          onClick={handleAddChore}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-bold"
        >
          Add Chore
        </button>

      </div>

    </div>
  );
}
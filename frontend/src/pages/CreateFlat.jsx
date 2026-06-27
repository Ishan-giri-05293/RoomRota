import { useState } from "react";
import API from "../services/api";

export default function CreateFlat() {

  const [flatName, setFlatName] = useState("");

  const handleCreateFlat = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await API.post("/flat/create", {
        flatName,
        uid: user.uid,
      });

      console.log(res.data);

      alert("Flat Created 😈");

    } catch (err) {

      console.log(err);

      alert("Failed 💀");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-8 rounded-2xl w-[350px]">

        <h1 className="text-white text-3xl font-bold mb-6">
          Create Flat 🏠
        </h1>

        <input
          type="text"
          placeholder="Flat Name"
          value={flatName}
          onChange={(e) => setFlatName(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-4 outline-none"
        />

        <button
          onClick={handleCreateFlat}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-bold"
        >
          Create Flat
        </button>

      </div>

    </div>
  );
}
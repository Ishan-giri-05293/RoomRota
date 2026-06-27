import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { flatService } from "../services/flatService";

export default function CreateFlat() {
  const [flatName, setFlatName] = useState("");
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleCreateFlat = async () => {
    if (!flatName.trim()) return alert("Please enter a flat name");

    try {
      const data = await flatService.create(flatName);
      
      // SYNC: Tell the app we now have a flatId
      updateUser({ flatId: data.flatId });

      alert("Flat Created 🏠😈");
      navigate("/dashboard"); // Redirect so Dashboard can fetch the new flat
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error?.message || "Failed to create flat 💀");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl w-[350px] border border-zinc-800">
        <h1 className="text-white text-3xl font-bold mb-6 text-center">Create Flat 🏠</h1>
        <input
          type="text"
          placeholder="Flat Name"
          value={flatName}
          onChange={(e) => setFlatName(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-4 outline-none border border-transparent focus:border-violet-500"
        />
        <button
          onClick={handleCreateFlat}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-bold transition-colors"
        >
          Create Flat
        </button>
      </div>
    </div>
  );
}
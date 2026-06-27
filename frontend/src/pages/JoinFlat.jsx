import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { flatService } from "../services/flatService";
import { useAuth } from "../context/AuthContext";

export default function JoinFlat() {
  const [inviteCode, setInviteCode] = useState("");
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleJoinFlat = async () => {
    try {
      const data = await flatService.join(inviteCode.trim());
      updateUser({ flatId: data.flatId }); // Sync global state
      alert("Joined Flat 😈");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error?.message || "Join Failed 💀");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl w-[350px]">
        <h1 className="text-white text-3xl font-bold mb-6">Join Flat 🚪</h1>
        <input
          type="text"
          placeholder="Invite Code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-4 outline-none border border-transparent focus:border-violet-500"
        />
        <button
          onClick={handleJoinFlat}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-bold transition-colors"
        >
          Join Flat
        </button>
      </div>
    </div>
  );
}
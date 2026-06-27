import { useState } from "react";
import API from "../services/api";

export default function JoinFlat() {

  const [inviteCode, setInviteCode] = useState("");

  const handleJoinFlat = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      console.log("Invite Code:", inviteCode);

      const res = await API.post("/flat/join", {
        inviteCode: inviteCode.trim(),
        uid: user.uid,
      });

      console.log(res.data);

      alert("Joined Flat 😈");

    } catch (err) {

      console.log(err);

      console.log(err.response?.data);

      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Join Failed 💀"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-8 rounded-2xl w-[350px]">

        <h1 className="text-white text-3xl font-bold mb-6">
          Join Flat 🚪
        </h1>

        <input
          type="text"
          placeholder="Invite Code"
          value={inviteCode}
          onChange={(e) =>
            setInviteCode(e.target.value.toUpperCase())
          }
          className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-4 outline-none"
        />

        <button
          onClick={handleJoinFlat}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-bold"
        >
          Join Flat
        </button>

      </div>

    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [chores, setChores] = useState([]);
  const [flatData, setFlatData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [membersData, setMembersData] = useState([]);

  useEffect(() => {
    fetchFlatData();
  }, [user?.flatId]); // Re-fetch if flatId changes

  const fetchFlatData = async () => {
    try {
      // Use user from context instead of manual JSON.parse
      if (!user?.flatId) return;

      // Fetch flat details
      const res = await API.get(`/flat/${user.flatId}`);
      setFlatData(res.data);

      // Fetch leaderboard
      const leaderboardRes = await API.get(`/flat/leaderboard/${user.flatId}`);
      setLeaderboard(leaderboardRes.data);
      setMembersData(leaderboardRes.data);

      // Fetch chores
      const choreRes = await API.get(`/chore/${user.flatId}`);
      setChores(choreRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const handleComplete = async (choreId) => {
    try {
      await API.patch(`/chore/complete/${choreId}`);
      alert("Chore Completed 😈");
      fetchFlatData();
    } catch (err) {
      console.error(err);
      alert("Failed 💀");
    }
  };

  const handleToggle = async (uid) => {
    try {
      await API.patch(`/auth/availability/${uid}`);
      fetchFlatData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout(); 
    // ProtectedRoute will automatically redirect to "/" because user becomes null
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* TOP BUTTONS */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <Link to="/create-flat" className="bg-violet-600 px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors">
          Create Flat
        </Link>
        <Link to="/join-flat" className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Join Flat
        </Link>
        <Link to="/add-chore" className="bg-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-black font-medium">
          Add Chore
        </Link>
        <Link to="/auto-assign" className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          Smart Assign
        </Link>
        <button
          onClick={handleLogout}
          className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Logout
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-8">Dashboard 💀</h1>

      {flatData ? (
        <>
          {/* FLAT INFO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-xl font-bold text-gray-400">Flat Name</h2>
              <p className="text-2xl mt-4 font-semibold">{flatData.flatName}</p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-xl font-bold text-gray-400">Invite Code</h2>
              <p className="text-2xl mt-4 font-mono text-violet-400">{flatData.inviteCode}</p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-xl font-bold text-gray-400">Members</h2>
              <p className="text-2xl mt-4 font-semibold">{flatData.members?.length || 0}</p>
            </div>
          </div>

          {/* CHORES */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Chores 🧹</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {chores.length > 0 ? (
                chores.map((chore) => (
                  <div key={chore.choreId} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <h3 className="text-xl font-semibold">{chore.title}</h3>
                    <p className={`mt-2 ${chore.completed ? "text-green-400" : "text-yellow-400"}`}>
                      {chore.completed ? "✅ Completed" : "⌛ Pending"}
                    </p>
                    <p className="text-gray-500 mt-2 text-sm">
                      Assigned To: {
                        chore.assignedTo
                          ? membersData.find((u) => u.uid === chore.assignedTo)?.name || "Unknown"
                          : "Unassigned"
                      }
                    </p>
                    {!chore.completed && (
                      <button
                        onClick={() => handleComplete(chore.choreId)}
                        className="mt-4 w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        Complete ✅
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">No chores yet 😭</p>
              )}
            </div>
          </div>

          {/* LEADERBOARD */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-violet-400">Leaderboard 👑</h2>
            <div className="space-y-4">
              {leaderboard.map((u, index) => (
                <div
                  key={u.uid}
                  className={`bg-zinc-900 p-4 rounded-xl flex justify-between items-center border ${
                    u.uid === user.uid ? "border-violet-500" : "border-zinc-800"
                  }`}
                >
                  <div>
                    <Link to={`/profile/${u.uid}`}>
                      <h3 className="text-xl font-semibold hover:text-violet-400 transition-colors">
                        #{index + 1} {u.name} {u.uid === user.uid && "(You)"}
                      </h3>
                    </Link>
                    <p className="text-gray-400">Score: {u.score}</p>
                    <p className={`text-sm mt-1 ${u.isAvailable ? "text-green-500" : "text-red-500"}`}>
                      {u.isAvailable ? "🟢 Available" : "🔴 Busy"}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="text-3xl">{index === 0 ? "👑" : "🔥"}</div>
                    {user.uid === u.uid && (
                      <button
                        onClick={() => handleToggle(u.uid)}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        Toggle Status
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-zinc-900 p-10 rounded-2xl text-center border border-dashed border-zinc-700">
          <p className="text-gray-400 text-xl">No Flat Joined Yet 😭</p>
          <p className="text-gray-500 mt-2">Create or join a flat to get started!</p>
        </div>
      )}
    </div>
  );
}
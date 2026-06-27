import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { flatService } from "../services/flatService";
import { choreService } from "../services/choreService";

export default function Profile() {
  const { uid } = useParams();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [pendingChores, setPendingChores] = useState([]);

  useEffect(() => {
    if (user?.flatId) fetchProfile();
  }, [uid, user?.flatId]);

  const fetchProfile = async () => {
    try {
      const leaderboard = await flatService.getLeaderboard(user.flatId);
      const foundUser = leaderboard.find((u) => u.uid === uid);
      setUserData(foundUser);

      const chores = await choreService.getAll(user.flatId);
      const userPendingChores = chores.filter(
        (chore) => chore.assignedTo === uid && !chore.completed
      );
      setPendingChores(userPendingChores);
    } catch (err) {
      console.error(err);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading 😈
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="bg-zinc-900 p-8 rounded-2xl max-w-xl mx-auto border border-zinc-800">
        <h1 className="text-4xl font-bold mb-6">{userData.name} 😈</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-zinc-800 p-4 rounded-xl">
            <h2 className="text-gray-400 font-bold">Score 👑</h2>
            <p className="text-2xl mt-1">{userData.score}</p>
          </div>
          <div className="bg-zinc-800 p-4 rounded-xl">
            <h2 className="text-gray-400 font-bold">Workload 🧹</h2>
            <p className="text-2xl mt-1">{userData.currentChoreCount}</p>
          </div>
        </div>

        <div className="mt-4 bg-zinc-800 p-4 rounded-xl">
          <h2 className="text-gray-400 font-bold">Last Chore 📌</h2>
          <p className="text-xl mt-1">{userData.lastChore || "None"}</p>
        </div>

        <div className="mt-4 bg-zinc-800 p-4 rounded-xl">
          <h2 className="text-gray-400 font-bold">Availability ⚡</h2>
          <p className={`text-xl mt-1 ${userData.isAvailable ? "text-green-400" : "text-red-400"}`}>
            {userData.isAvailable ? "Available" : "Busy"}
          </p>
        </div>

        <div className="mt-6 bg-zinc-800 p-4 rounded-xl">
          <h2 className="text-lg font-bold mb-3">Pending Chores ⏳</h2>
          {pendingChores.length > 0 ? (
            <div className="space-y-2">
              {pendingChores.map((chore) => (
                <div key={chore.choreId} className="bg-zinc-700 p-3 rounded-lg border border-zinc-600">
                  {chore.title}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-center py-2">No pending chores 😈</p>
          )}
        </div>
      </div>
    </div>
  );
}
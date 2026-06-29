import { Link } from "react-router-dom";
import API from "../../services/api";

export default function Leaderboard({ leaderboard, currentUser, onRefresh }) {
  const handleToggle = async (uid) => {
    try {
      await API.patch(`/auth/availability/${uid}`);
      onRefresh(); // Trigger a data refresh in the parent
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {leaderboard.map((u, index) => (
        <div
          key={u.uid}
          className={`bg-zinc-900 p-4 rounded-xl flex justify-between items-center border ${
            u.uid === currentUser.uid
              ? "border-violet-500"
              : "border-zinc-800"
          }`}
        >
          <div>
            <Link to={`/profile/${u.uid}`}>
              <h3 className="text-xl font-semibold hover:text-violet-400 transition-colors">
                #{index + 1} {u.name}{" "}
                {u.uid === currentUser.uid && "(You)"}
              </h3>
            </Link>

            <div className="flex gap-4 text-sm mt-1">
              <p className="text-gray-400">
                Completed:{" "}
                <span className="text-white font-bold">
                  {u.completedCount || 0}
                </span>
              </p>

              <p className="text-gray-400">
                Assigned:{" "}
                <span className="text-white">
                  {u.assignedCount || 0}
                </span>
              </p>
            </div>

            <p
              className={`text-xs mt-2 ${
                u.isAvailable ? "text-green-500" : "text-red-500"
              }`}
            >
              {u.isAvailable ? "🟢 Available" : "🔴 Busy"}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl">
              {index === 0 ? "👑" : "🔥"}
            </div>

            {currentUser.uid === u.uid && (
              <button
                onClick={() => handleToggle(u.uid)}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm transition-colors font-medium"
              >
                Toggle Status
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
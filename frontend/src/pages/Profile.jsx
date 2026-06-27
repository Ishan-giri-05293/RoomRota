import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function Profile() {

  const { uid } = useParams();

  const [userData, setUserData] = useState(null);
  const [pendingChores, setPendingChores] = useState([]);

  useEffect(() => {

    fetchProfile();

  }, []);

  const fetchProfile = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      // Get leaderboard users
      const res = await API.get(
        `/flat/leaderboard/${user.flatId}`
      );

      const foundUser = res.data.find(
        (u) => u.uid === uid
      );

      setUserData(foundUser);

      // Get chores
      const choreRes = await API.get(
        `/chore/${user.flatId}`
      );

      const userPendingChores =
        choreRes.data.filter(
          (chore) =>
            chore.assignedTo === uid &&
            !chore.completed
        );

      setPendingChores(userPendingChores);

    } catch (err) {

      console.log(err);
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

      <div className="bg-zinc-900 p-8 rounded-2xl max-w-xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          {userData.name} 😈
        </h1>

        <div className="space-y-4">

          {/* SCORE */}

          <div className="bg-zinc-800 p-4 rounded-xl">

            <h2 className="text-lg font-bold">
              Score 👑
            </h2>

            <p className="text-2xl mt-2">
              {userData.score}
            </p>

          </div>

          {/* WORKLOAD */}

          <div className="bg-zinc-800 p-4 rounded-xl">

            <h2 className="text-lg font-bold">
              Current Workload 🧹
            </h2>

            <p className="text-2xl mt-2">
              {userData.currentChoreCount}
            </p>

          </div>

          {/* LAST CHORE */}

          <div className="bg-zinc-800 p-4 rounded-xl">

            <h2 className="text-lg font-bold">
              Last Chore 📌
            </h2>

            <p className="text-2xl mt-2">
              {userData.lastChore || "None"}
            </p>

          </div>

          {/* AVAILABILITY */}

          <div className="bg-zinc-800 p-4 rounded-xl">

            <h2 className="text-lg font-bold">
              Availability ⚡
            </h2>

            <p className="text-2xl mt-2">

              {userData.isAvailable
                ? "🟢 Available"
                : "🔴 Busy"}

            </p>

          </div>

          {/* PENDING CHORES */}

          <div className="bg-zinc-800 p-4 rounded-xl">

            <h2 className="text-lg font-bold mb-3">
              Pending Chores ⏳
            </h2>

            {pendingChores.length > 0 ? (

              <div className="space-y-2">

                {pendingChores.map((chore) => (

                  <div
                    key={chore.choreId}
                    className="bg-zinc-700 p-3 rounded-lg"
                  >
                    {chore.title}
                  </div>

                ))}

              </div>

            ) : (

              <p className="text-gray-400">
                No pending chores 😈
              </p>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}
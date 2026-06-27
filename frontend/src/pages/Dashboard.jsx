import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {

  const [chores, setChores] = useState([]);
  const [flatData, setFlatData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [membersData, setMembersData] = useState([]);

  useEffect(() => {

    fetchFlatData();

  }, []);

  const fetchFlatData = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user.flatId) return;

      // Fetch flat details
      const res = await API.get(
        `/flat/${user.flatId}`
      );

      setFlatData(res.data);

      // Fetch leaderboard
      const leaderboardRes = await API.get(
        `/flat/leaderboard/${user.flatId}`
      );

      setLeaderboard(leaderboardRes.data);

      setMembersData(leaderboardRes.data);

      // Fetch chores
      const choreRes = await API.get(
        `/chore/${user.flatId}`
      );

      setChores(choreRes.data);

    } catch (err) {

      console.log(err);
    }
  };

  const handleComplete = async (choreId) => {

    try {

      const res = await API.patch(
        `/chore/complete/${choreId}`
      );

      console.log(res.data);

      alert("Chore Completed 😈");

      fetchFlatData();

    } catch (err) {

      console.log(err);

      alert("Failed 💀");
    }
  };

  const handleToggle = async (uid) => {

    try {

      const res = await API.patch(
        `/auth/availability/${uid}`
      );

      console.log(res.data);

      fetchFlatData();

    } catch (err) {

      console.log(err);
    }
  };
  const handleLogout = () => {

  localStorage.removeItem("token");

  localStorage.removeItem("user");

  window.location.href = "/"; };

  return (

    <div className="min-h-screen bg-black text-white p-8">

      {/* TOP BUTTONS */}

      <div className="flex gap-4 mb-8 flex-wrap">

        <Link
          to="/create-flat"
          className="bg-violet-600 px-4 py-2 rounded-lg"
        >
          Create Flat
        </Link>

        <Link
          to="/join-flat"
          className="bg-green-600 px-4 py-2 rounded-lg"
        >
          Join Flat
        </Link>

        <Link
          to="/add-chore"
          className="bg-yellow-600 px-4 py-2 rounded-lg"
        >
          Add Chore
        </Link>

        <Link
          to="/auto-assign"
          className="bg-red-600 px-4 py-2 rounded-lg"
        >
          Smart Assign
        </Link>
        <button
        onClick={handleLogout}
        className="bg-gray-700 px-4 py-2 rounded-lg"
        >
        Logout
        </button>

      </div>

      <h1 className="text-4xl font-bold mb-8">
        Dashboard 💀
      </h1>

      {flatData ? (

        <>

          {/* FLAT INFO */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-zinc-900 p-6 rounded-2xl">

              <h2 className="text-xl font-bold">
                Flat Name
              </h2>

              <p className="text-2xl mt-4">
                {flatData.flatName}
              </p>

            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl">

              <h2 className="text-xl font-bold">
                Invite Code
              </h2>

              <p className="text-2xl mt-4">
                {flatData.inviteCode}
              </p>

            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl">

              <h2 className="text-xl font-bold">
                Members
              </h2>

              <p className="text-2xl mt-4">
                {flatData.members.length}
              </p>

            </div>

          </div>

          {/* CHORES */}

          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-4">
              Chores 🧹
            </h2>

            <div className="space-y-4">

              {chores.length > 0 ? (

                chores.map((chore) => (

                  <div
                    key={chore.choreId}
                    className="bg-zinc-900 p-4 rounded-xl"
                  >

                    <h3 className="text-xl font-semibold">
                      {chore.title}
                    </h3>

                    <p className="text-gray-400 mt-2">
                      {chore.completed
                        ? "✅ Completed"
                        : "⌛ Pending"}
                    </p>

                    <p className="text-gray-500 mt-2">

                      Assigned To: {

                       chore.assignedTo
                         ? membersData.find(
                              (u) => u.uid === chore.assignedTo
                            )?.name || "Unknown"
                          : "Unassigned"

                      }

                    </p>

                    {!chore.completed && (

                      <button
                        onClick={() =>
                          handleComplete(chore.choreId)
                        }
                        className="mt-4 bg-green-600 px-4 py-2 rounded-lg"
                      >
                        Complete ✅
                      </button>

                    )}

                  </div>

                ))

              ) : (

                <p className="text-gray-400">
                  No chores yet 😭
                </p>

              )}

            </div>

          </div>

          {/* LEADERBOARD */}

          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-4">
              Leaderboard 👑
            </h2>

            <div className="space-y-4">

              {leaderboard.map((user, index) => (

                <div
                  key={user.uid}
                  className="bg-zinc-900 p-4 rounded-xl flex justify-between items-center"
                >

                  <div>

                    <Link to={`/profile/${user.uid}`}>
                      <h3 className="text-xl font-semibold hover:text-violet-400">
                        #{index + 1} {user.name}
                      </h3>
                    </Link>  

                    <p className="text-gray-400">
                      Score: {user.score}
                    </p>

                    <p className="text-sm mt-1">

                      {user.isAvailable
                        ? "🟢 Available"
                        : "🔴 Busy"}

                    </p>

                  </div>

                  <div className="flex flex-col items-center">

                    <div className="text-3xl">

                      {index === 0
                        ? "👑"
                        : "🔥"}

                    </div>

                    {JSON.parse(
                      localStorage.getItem("user")
                    ).uid === user.uid && (

                      <button
                        onClick={() =>
                          handleToggle(user.uid)
                        }
                        className="mt-2 bg-blue-600 px-3 py-1 rounded-lg text-sm"
                      >
                        Toggle
                      </button>

                    )}

                  </div>

                </div>

              ))}

            </div>

          </div>

        </>

      ) : (

        <p className="text-gray-400">
          No Flat Joined Yet 😭
        </p>

      )}

    </div>
  );
}
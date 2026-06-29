import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { flatService } from "../services/flatService";
import { choreService } from "../services/choreService";
import { eventService } from "../services/eventService";

// Modular Components
import FlatStats from "../components/Dashboard/FlatStats";
import ChoreSection from "../components/Dashboard/ChoreSection";
import Leaderboard from "../components/Dashboard/Leaderboard";
import ActivityLog from "../components/Dashboard/ActivityLog";

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth();
  
  const [chores, setChores] = useState([]);
  const [flatData, setFlatData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [events, setEvents] = useState([]); // New state for events
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    if (!user?.flatId) {
      setLoading(false);
      return;
    }

    try {
      // Use individual try-catches or separate calls so one failure 
      // (like the Activity Log) doesn't kill the whole dashboard.
      const details = await flatService.getDetails(user.flatId);
      setFlatData(details);

      const lb = await flatService.getLeaderboard(user.flatId);
      setLeaderboard(lb);

      const choreList = await choreService.getAll(user.flatId);
      setChores(choreList);

      // Fetch events separately - if this fails, the app continues
      try {
        const eventList = await eventService.getEvents(user.flatId);
        setEvents(eventList);
      } catch (e) {
        console.error("Activity Log failed to load, but dashboard is safe.");
      }

    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.flatId]);

  useEffect(() => {
    fetchAllData();
    window.addEventListener("focus", fetchAllData);
    return () => window.removeEventListener("focus", fetchAllData);
  }, [fetchAllData]);

  const handleLeave = async () => {
    if (!window.confirm("Leave the flat? 🚪")) return;
    try {
      await flatService.leave();
      updateUser({ flatId: null });
      setFlatData(null);
    } catch (err) {
      alert("Failed 💀");
    }
  };

  const handleCompleteChore = async (id) => {
    try {
      await choreService.complete(id);
      fetchAllData();
    } catch (err) {
      alert("Failed 💀");
    }
  };

  const handleDeleteChore = async (id) => {
    if (!window.confirm("Delete chore? 🗑️")) return;
    try {
      await choreService.delete(id);
      fetchAllData();
    } catch (err) {
      alert("Failed 💀");
    }
  };

  const handleUpdateChore = async (id, data) => {
    try {
      await choreService.update(id, data);
      fetchAllData();
    } catch (err) {
      alert("Update failed 💀");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="animate-pulse">Loading RoomRota... 😈</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex gap-4 mb-8 flex-wrap">
        <Link to="/create-flat" className="bg-violet-600 px-4 py-2 rounded-lg font-bold">Create Flat</Link>
        <Link to="/join-flat" className="bg-green-600 px-4 py-2 rounded-lg font-bold">Join Flat</Link>
        <Link to="/add-chore" className="bg-yellow-600 px-4 py-2 rounded-lg text-black font-bold">Add Chore</Link>
        <Link to="/auto-assign" className="bg-red-600 px-4 py-2 rounded-lg font-bold">Smart Assign</Link>
        <button onClick={logout} className="bg-gray-700 px-4 py-2 rounded-lg font-bold">Logout</button>
      </div>

      <h1 className="text-4xl font-bold mb-8 tracking-tight">Dashboard 💀</h1>

      {user?.flatId && flatData ? (
        <div className="space-y-10">
          <FlatStats flatData={flatData} onLeave={handleLeave} />
          
          <ChoreSection 
            chores={chores} 
            members={leaderboard} 
            onComplete={handleCompleteChore}
            onDelete={handleDeleteChore}
            onUpdate={handleUpdateChore}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4 text-violet-400">Leaderboard 👑</h2>
              <Leaderboard leaderboard={leaderboard} currentUser={user} onRefresh={fetchAllData} />
            </div>
            <div className="lg:col-span-1">
              <ActivityLog events={events} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900 p-10 rounded-2xl text-center border border-dashed border-zinc-700">
          <p className="text-zinc-400 text-xl">No Flat Joined Yet 😭</p>
        </div>
      )}
    </div>
  );
}
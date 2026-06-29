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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    if (!user?.flatId) {
      setLoading(false);
      return;
    }

    try {
      // Parallel fetch for core data
      const [details, lb, choreList] = await Promise.all([
        flatService.getDetails(user.flatId),
        flatService.getLeaderboard(user.flatId),
        choreService.getAll(user.flatId),
      ]);

      setFlatData(details);
      setLeaderboard(lb);
      setChores(choreList);

      // Separate fetch for non-critical Activity Log
      try {
        const eventList = await eventService.getEvents(user.flatId);
        setEvents(eventList);
      } catch (e) {
        console.error("Activity Log failed to load, but dashboard is safe.", e);
      }

    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.flatId]);

  useEffect(() => {
    fetchAllData();

    // Refresh data when user switches back to this browser tab
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
      alert("Failed to leave flat 💀");
    }
  };

  const handleCompleteChore = async (id) => {
    try {
      await choreService.complete(id);
      fetchAllData();
    } catch (err) {
      alert("Failed to complete chore 💀");
    }
  };

  const handleDeleteChore = async (id) => {
    if (!window.confirm("Delete this chore? 🗑️")) return;
    try {
      await choreService.delete(id);
      fetchAllData();
    } catch (err) {
      alert("Failed to delete chore 💀");
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

  const handleUndoChore = async (id) => {
    try {
      await choreService.undo(id);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.error?.message || "Undo failed 💀");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="animate-pulse">Loading RoomRota... 😈</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* TOP NAVIGATION */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <Link to="/create-flat" className="bg-violet-600 px-4 py-2 rounded-lg font-bold hover:bg-violet-700 transition-colors">
          Create Flat
        </Link>
        <Link to="/join-flat" className="bg-green-600 px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors">
          Join Flat
        </Link>
        <Link to="/add-chore" className="bg-yellow-600 px-4 py-2 rounded-lg text-black font-bold hover:bg-yellow-700 transition-colors">
          Add Chore
        </Link>
        <Link to="/auto-assign" className="bg-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors">
          Smart Assign
        </Link>
        <button onClick={logout} className="bg-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors">
          Logout
        </button>
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
            onUndo={handleUndoChore}
            currentUser={user}
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
          <p className="text-zinc-500 mt-2 text-sm">Create or join a flat to see your chores!</p>
        </div>
      )}
    </div>
  );
}
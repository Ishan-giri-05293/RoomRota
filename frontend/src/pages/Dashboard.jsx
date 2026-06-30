import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Calendar, Users, Settings, Plus, CheckCircle2, 
  Clock, LayoutGrid, LogOut, ArrowRight, Sparkles 
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { flatService } from "../services/flatService";
import { choreService } from "../services/choreService";
import { eventService } from "../services/eventService";

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
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
      const [details, lb, choreList] = await Promise.all([
        flatService.getDetails(user.flatId),
        flatService.getLeaderboard(user.flatId),
        choreService.getAll(user.flatId),
      ]);
      setFlatData(details);
      setLeaderboard(lb);
      setChores(choreList);
      try {
        const eventList = await eventService.getEvents(user.flatId);
        setEvents(eventList);
      } catch (e) { console.error(e); }
    } catch (err) { console.error(err);
    } finally { setLoading(false); }
  }, [user?.flatId]);

  useEffect(() => {
    fetchAllData();
    window.addEventListener("focus", fetchAllData);
    return () => window.removeEventListener("focus", fetchAllData);
  }, [fetchAllData]);

  const handleComplete = async (id) => {
    try {
      await choreService.complete(id);
      fetchAllData();
    } catch (err) { alert("Failed to complete chore"); }
  };

  // Filter chores for "Your Focus" section
  const myChores = chores.filter(c => c.assignedTo === user?.uid && !c.completed);

  if (loading) return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-protocol-blue/10 border-t-protocol-blue rounded-full animate-spin" />
        <p className="text-ink-secondary text-sm font-medium animate-pulse">Restoring peace...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row selection:bg-protocol-blue/10">
      
      {/* SIDEBAR - Desktop Only */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-border-subtle p-6 fixed h-full z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 rounded-xl bg-protocol-blue flex items-center justify-center text-white shadow-lg shadow-protocol-blue/20">
            <Home size={18} />
          </div>
          <span className="font-semibold text-ink-primary tracking-tight text-lg">RoomRota</span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem icon={<LayoutGrid size={18} />} label="Dashboard" active />
          <SidebarItem icon={<Calendar size={18} />} label="Schedule" onClick={() => navigate('/auto-assign')} />
          <SidebarItem
  icon={<Users size={18} />}
  label="Roommates"
  onClick={() => navigate('/pulse')}
/>
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
        </nav>

        <button 
          onClick={logout}
          className="mt-auto flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-medium text-ink-secondary hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 pb-32">
        {!user?.flatId ? (
          /* EMPTY STATE - Not in a flat */
          <div className="max-w-[500px] mx-auto mt-20 text-center">
            <div className="w-20 h-20 bg-white rounded-[32px] shadow-soft-smoke border border-border-subtle flex items-center justify-center mx-auto mb-8">
              <Sparkles className="text-protocol-blue" size={32} />
            </div>
            <h1 className="text-3xl font-medium text-ink-primary mb-4 tracking-tight">Welcome home.</h1>
            <p className="text-ink-secondary mb-10 leading-relaxed">You haven't joined a house yet. Let's get your living space organized.</p>
            <div className="space-y-4">
              <Link to="/create-flat" className="block w-full bg-protocol-blue text-white py-4 rounded-full font-medium hover:brightness-110 transition-all">Create a House</Link>
              <Link to="/join-flat" className="block w-full text-ink-secondary hover:text-ink-primary font-medium transition-colors">Join an existing house</Link>
            </div>
          </div>
        ) : (
          /* ACTIVE DASHBOARD */
          <div className="max-w-[850px] mx-auto">
            <header className="mb-12 flex justify-between items-end">
              <div>
                <span className="text-[11px] font-bold text-protocol-blue uppercase tracking-[0.2em] mb-2 block">Overview</span>
                <h1 className="text-3xl font-medium text-ink-primary tracking-tight">
                  Hello, {user?.displayName || 'Resident'}.
                </h1>
              </div>
              <Link to="/add-chore" className="hidden md:flex items-center gap-2 bg-white border border-border-subtle px-5 py-2.5 rounded-xl text-[13px] font-semibold text-ink-primary hover:shadow-md transition-all active:scale-[0.98]">
                <Plus size={18} className="text-protocol-blue" />
                Add Chore
              </Link>
            </header>

            {/* YOUR FOCUS SECTION */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-5 px-1">
                <h2 className="text-sm font-bold text-ink-secondary uppercase tracking-widest">Your Focus</h2>
                <span className="text-xs font-medium text-ink-secondary/60">{myChores.length} tasks pending</span>
              </div>

              {myChores.length > 0 ? (
                <div className="space-y-3">
                  {myChores.map(chore => (
                    <motion.div 
                      key={chore.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-[24px] border border-border-subtle p-5 flex items-center justify-between shadow-soft-smoke group hover:border-protocol-blue/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-canvas flex items-center justify-center text-ink-secondary group-hover:text-protocol-blue group-hover:bg-protocol-blue/5 transition-colors">
                          <Clock size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-ink-primary">{chore.title}</h4>
                          <p className="text-xs text-ink-secondary">{chore.frequency || 'Weekly'} rhythm</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleComplete(chore.id)}
                        className="bg-protocol-blue/5 text-protocol-blue hover:bg-protocol-blue hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                      >
                        <CheckCircle2 size={16} />
                        Done
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-dashed border-border-subtle rounded-[24px] py-12 text-center">
                  <p className="text-ink-secondary text-sm font-medium">All clear. Enjoy the quiet.</p>
                </div>
              )}
            </section>

            {/* HOUSE STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-[28px] border border-border-subtle shadow-soft-smoke">
                <h3 className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-4">House Status</h3>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-2xl font-semibold text-ink-primary">Healthy</span>
                  <span className="text-xs font-bold text-green-500 uppercase">Active</span>
                </div>
                <div className="h-1.5 w-full bg-canvas rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-protocol-blue rounded-full" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-[28px] border border-border-subtle shadow-soft-smoke flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-2">Roommates</h3>
                  <div className="flex -space-x-2">
                    {leaderboard.slice(0, 4).map((m, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-canvas flex items-center justify-center text-[10px] font-bold text-ink-secondary">
                        {m.name?.substring(0, 2).toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => navigate('/join-flat')} className="text-protocol-blue p-2 hover:bg-protocol-blue/5 rounded-full transition-colors">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-border-subtle px-8 py-4 flex justify-between items-center z-50">
        <button onClick={() => navigate('/dashboard')} className="text-protocol-blue"><Home size={22} /></button>
        <button onClick={() => navigate('/auto-assign')} className="text-ink-secondary"><Calendar size={22} /></button>
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <Link to="/add-chore" className="w-12 h-12 bg-protocol-blue rounded-2xl text-white shadow-lg shadow-protocol-blue/30 flex items-center justify-center">
            <Plus size={24} />
          </Link>
        </div>
        <button
  onClick={() => navigate('/pulse')}
  className="text-ink-secondary"
>
  <Users size={22} />
</button>
        <button onClick={() => navigate('/profile/' + user?.uid)} className="text-ink-secondary"><Settings size={22} /></button>
      </nav>
    </div>
  );
}

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
      active ? 'bg-protocol-blue/5 text-protocol-blue shadow-sm' : 'text-ink-secondary hover:bg-canvas hover:text-ink-primary'
    }`}
  >
    {icon}
    {label}
  </button>
);
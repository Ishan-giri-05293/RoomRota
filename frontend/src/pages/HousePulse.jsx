import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  History,
  ChevronLeft,
  Trophy,
  Sparkles,
  Home,
  Calendar,
  LayoutGrid,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { flatService } from "../services/flatService";
import { eventService } from "../services/eventService";
import { useAuth } from "../context/AuthContext";

export default function HousePulse() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user?.flatId) return;

    try {
      const [lb, eventList] = await Promise.all([
        flatService.getLeaderboard(user.flatId),
        eventService.getEvents(user.flatId),
      ]);

      setLeaderboard(lb);
      setEvents(eventList);
    } catch (err) {
      console.error("Pulse Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.flatId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-protocol-blue/10 border-t-protocol-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-border-subtle p-6 fixed h-full z-20">
        <div
          className="flex items-center gap-3 mb-10 px-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-8 h-8 rounded-xl bg-protocol-blue flex items-center justify-center text-white shadow-lg shadow-protocol-blue/20">
            <Home size={18} />
          </div>
          <span className="font-semibold text-ink-primary tracking-tight text-lg">
            RoomRota
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem
            icon={<LayoutGrid size={18} />}
            label="Dashboard"
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon={<Calendar size={18} />}
            label="Schedule"
            onClick={() => navigate("/auto-assign")}
          />

          <SidebarItem
            icon={<Users size={18} />}
            label="Roommates"
            active
          />

          <SidebarItem
            icon={<Settings size={18} />}
            label="Settings"
          />
        </nav>

        <button
          onClick={logout}
          className="mt-auto flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-medium text-ink-secondary hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 pb-32">
        <div className="max-w-[850px] mx-auto">
          {/* UPDATED HEADER */}
          <header className="mb-12 flex justify-between items-end">
            <div>
              <span className="text-[11px] font-bold text-protocol-blue uppercase tracking-[0.2em] mb-2 block">
                House Pulse
              </span>

              <h1 className="text-3xl font-medium text-ink-primary tracking-tight">
                The rhythm of your home.
              </h1>
            </div>

            <button
              onClick={() => navigate("/join-flat")}
              className="flex items-center gap-2 bg-white border border-border-subtle px-4 py-2 rounded-xl text-[13px] font-semibold text-ink-primary hover:shadow-md transition-all active:scale-95"
            >
              <Plus size={16} className="text-protocol-blue" />
              Invite
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* LEADERBOARD */}
            <section className="lg:col-span-3 space-y-6">
              <h2 className="text-sm font-bold text-ink-secondary uppercase tracking-widest px-1">
                Contributions
              </h2>

              <div className="bg-white rounded-[32px] border border-border-subtle p-2 shadow-soft-smoke">
                {leaderboard.map((member, index) => (
                  <div
                    key={member.uid}
                    className={`flex items-center justify-between p-5 rounded-[24px] ${
                      member.uid === user?.uid
                        ? "bg-protocol-blue/[0.03]"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-canvas border border-border-subtle flex items-center justify-center text-lg font-medium text-ink-secondary">
                        {member.name?.substring(0, 1).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-ink-primary">
                          {member.name}{" "}
                          {member.uid === user?.uid && "(You)"}
                        </p>

                        <p className="text-[11px] text-ink-secondary font-bold uppercase tracking-tighter">
                          {member.points || 0} rhythms completed
                        </p>
                      </div>
                    </div>

                    {index === 0 && (
                      <Sparkles
                        size={18}
                        className="text-yellow-500 mr-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* HISTORY */}
            <section className="lg:col-span-2 space-y-6">
              <h2 className="text-sm font-bold text-ink-secondary uppercase tracking-widest px-1">
                History
              </h2>

              <div className="space-y-6">
                {events.slice(0, 6).map((event, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-protocol-blue mt-2" />
                      <div className="w-px flex-1 bg-border-subtle" />
                    </div>

                    <div>
                      <p className="text-[13px] text-ink-primary leading-snug">
                        <span className="font-bold">
                          {event.userName}
                        </span>{" "}
                        completed{" "}
                        <span className="italic">
                          {event.choreName}
                        </span>
                      </p>

                      <p className="text-[11px] text-ink-secondary mt-1 font-medium">
                        {event.timeAgo || "Recently"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
      active
        ? "bg-protocol-blue/5 text-protocol-blue shadow-sm"
        : "text-ink-secondary hover:bg-canvas hover:text-ink-primary"
    }`}
  >
    {icon}
    {label}
  </button>
);
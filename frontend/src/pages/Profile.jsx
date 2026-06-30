import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Award, 
  LogOut, 
  ShieldCheck, 
  Bell,
  Home
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Mock stats - in production, these come from your leaderboard/history logic
  const stats = [
    { label: "Rhythms Completed", value: "42", icon: <Award size={18} /> },
    { label: "House Reliability", value: "98%", icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-canvas pb-32 pt-12 md:pt-20 px-6">
      <div className="max-w-[500px] mx-auto">
        
        {/* HEADER: Returning to Peace */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate("/dashboard")}
            className="p-2 -ml-2 text-ink-secondary hover:text-ink-primary transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold text-ink-primary tracking-tight">Your Identity</h1>
          <div className="w-10" />
        </div>

        {/* PROFILE CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-8 shadow-soft-smoke border border-border-subtle mb-8"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-[32px] bg-canvas border-4 border-white shadow-md flex items-center justify-center text-3xl font-semibold text-ink-secondary mb-6 overflow-hidden">
              {user?.name?.substring(0, 1).toUpperCase() || <User size={40} />}
            </div>
            <h2 className="text-2xl font-medium text-ink-primary tracking-tight">{user?.name || "Resident"}</h2>
            <p className="text-sm text-ink-secondary mt-1">{user?.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            {stats.map((stat, i) => (
              <div key={i} className="bg-canvas/50 rounded-2xl p-4 border border-border-subtle/50 text-center">
                <div className="text-protocol-blue mb-2 flex justify-center">{stat.icon}</div>
                <p className="text-xl font-bold text-ink-primary tracking-tight">{stat.value}</p>
                <p className="text-[10px] font-bold text-ink-secondary uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* SETTINGS GROUPS */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-ink-secondary uppercase tracking-[0.2em] ml-4 mb-2 block">Preferences</label>
          <div className="bg-white rounded-[28px] border border-border-subtle overflow-hidden shadow-sm">
            <SettingsItem icon={<Bell size={18} />} label="Notifications" />
            <SettingsItem icon={<Home size={18} />} label="House Settings" onClick={() => navigate('/pulse')} />
          </div>

          <label className="text-[11px] font-bold text-ink-secondary uppercase tracking-[0.2em] ml-4 mt-8 mb-2 block">Account</label>
          <div className="bg-white rounded-[28px] border border-border-subtle overflow-hidden shadow-sm">
            <SettingsItem 
              icon={<LogOut size={18} />} 
              label="Log out" 
              danger 
              onClick={() => {
                if(window.confirm("Ready to leave for now?")) logout();
              }} 
            />
          </div>
        </div>

        <p className="mt-12 text-center text-[11px] text-ink-secondary/40 font-medium uppercase tracking-[0.2em]">
          RoomRota v1.0 • Designed for Peace
        </p>
      </div>
    </div>
  );
}

// Sub-component for clean rows
const SettingsItem = ({ icon, label, onClick, danger = false }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between px-6 py-5 hover:bg-canvas transition-colors border-b border-border-subtle last:border-0 group"
  >
    <div className="flex items-center gap-4">
      <div className={`transition-colors ${danger ? 'text-red-400' : 'text-ink-secondary group-hover:text-protocol-blue'}`}>
        {icon}
      </div>
      <span className={`text-[15px] font-medium ${danger ? 'text-red-500' : 'text-ink-primary'}`}>{label}</span>
    </div>
    <ChevronLeft size={16} className="rotate-180 text-ink-secondary/30" />
  </button>
);
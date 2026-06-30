import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LinkIcon, ArrowRight, ChevronLeft, Sparkles } from "lucide-react";
import { flatService } from "../services/flatService";
import { useAuth } from "../context/AuthContext";

export default function JoinFlat() {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleJoinFlat = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setLoading(true);
    try {
      const data = await flatService.join(inviteCode.trim());
      updateUser({ flatId: data.flatId });
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error?.message || "Invalid invite code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 selection:bg-protocol-blue/10">
      
      {/* Back to Sanctuary */}
      <button 
        onClick={() => navigate("/dashboard")}
        className="absolute top-12 left-8 flex items-center gap-2 text-ink-secondary hover:text-ink-primary transition-colors text-sm font-medium"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[32px] w-full max-w-[400px] shadow-soft-smoke border border-border-subtle"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-protocol-blue/5 flex items-center justify-center text-protocol-blue mb-4">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-medium text-ink-primary tracking-tight">Join a house</h1>
          <p className="text-ink-secondary text-sm mt-2">Enter the invite code shared by your roommates.</p>
        </div>

        <form onSubmit={handleJoinFlat} className="space-y-6">
          <div className="relative group">
            <input
              autoFocus
              type="text"
              placeholder="ENTER-CODE"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="w-full p-4 rounded-2xl bg-canvas border border-border-subtle text-ink-primary outline-none focus:border-protocol-blue/30 transition-all text-sm font-bold tracking-widest text-center placeholder:text-ink-secondary/40 placeholder:font-medium placeholder:tracking-normal"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !inviteCode.trim()}
            className="w-full bg-protocol-blue text-white py-4 rounded-full font-medium transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-30 shadow-lg shadow-protocol-blue/10"
          >
            {loading ? "Joining..." : "Enter House"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-border-subtle">
           <p className="text-center text-[11px] text-ink-secondary leading-relaxed uppercase tracking-tighter font-semibold">
             By joining, you agree to the <br /> house rhythms and rotations.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
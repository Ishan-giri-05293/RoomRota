import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowRight, ChevronLeft, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { flatService } from "../services/flatService";

export default function CreateFlat() {
  const [flatName, setFlatName] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleCreateFlat = async (e) => {
    e.preventDefault();
    if (!flatName.trim()) return;

    setLoading(true);
    try {
      const data = await flatService.create(flatName);
      updateUser({ flatId: data.flatId });
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error?.message || "Failed to create house.");
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
            <Home size={24} />
          </div>
          <h1 className="text-2xl font-medium text-ink-primary tracking-tight">Name your house</h1>
          <p className="text-ink-secondary text-sm mt-2">This will be the shared space for you and your roommates.</p>
        </div>

        <form onSubmit={handleCreateFlat} className="space-y-6">
          <div className="relative group">
            <input
              autoFocus
              type="text"
              placeholder="e.g. The Sunny Side"
              value={flatName}
              onChange={(e) => setFlatName(e.target.value)}
              className="w-full p-4 rounded-2xl bg-canvas border border-border-subtle text-ink-primary outline-none focus:border-protocol-blue/30 transition-all text-sm font-medium placeholder:text-ink-secondary/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !flatName.trim()}
            className="w-full bg-protocol-blue text-white py-4 rounded-full font-medium transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-30 shadow-lg shadow-protocol-blue/10"
          >
            {loading ? "Creating..." : "Create House"}
            <ArrowRight size={18} />
          </button>
        </form>
      </motion.div>
      
      <p className="mt-8 text-xs text-ink-secondary/60 font-medium uppercase tracking-widest">Step 1: Define the space</p>
    </div>
  );
}
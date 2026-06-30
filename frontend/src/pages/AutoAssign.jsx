import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Wand2, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { choreService } from "../services/choreService";

export default function AutoAssign() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [assignedTo, setAssignedTo] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAutoAssign = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      const res = await choreService.autoAssign({
        title,
        flatId: user.flatId,
        difficulty: "medium",
        dueDate: null,
      });

      setAssignedTo(res.assignee.name);
      // Wait 2 seconds so the user can see the "Magic" happen
      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    } catch (err) {
      alert(err.response?.data?.error?.message || "Calibration failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 selection:bg-protocol-blue/10">
      
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
        className="bg-white p-10 rounded-[32px] w-full max-w-[400px] shadow-soft-smoke border border-border-subtle overflow-hidden relative"
      >
        <AnimatePresence mode="wait">
          {!assignedTo ? (
            <motion.div 
              key="form"
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-protocol-blue/5 flex items-center justify-center text-protocol-blue mx-auto mb-6">
                <Wand2 size={24} />
              </div>
              <h1 className="text-2xl font-medium text-ink-primary tracking-tight mb-2">Fair Balance</h1>
              <p className="text-ink-secondary text-sm mb-8">
                Tell us the task. We'll find the best person based on history and workload.
              </p>

              <form onSubmit={handleAutoAssign} className="space-y-6">
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. Clean the Fridge"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-canvas border border-border-subtle text-ink-primary outline-none focus:border-protocol-blue/30 transition-all text-sm font-medium"
                />

                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="w-full bg-protocol-blue text-white py-4 rounded-full font-medium transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-30 shadow-lg shadow-protocol-blue/10"
                >
                  {loading ? "Calculating..." : "Balance the House"}
                  {!loading && <Sparkles size={18} />}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-semibold text-ink-primary mb-2">Balance Restored</h2>
              <p className="text-ink-secondary text-sm">
                This rhythm has been assigned to <span className="text-protocol-blue font-bold">{assignedTo}</span>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-12 flex items-center gap-2 text-[11px] font-bold text-ink-secondary uppercase tracking-widest opacity-40">
        <ShieldCheck size={14} />
        Zero-Bias Protocol Active
      </div>
    </div>
  );
}
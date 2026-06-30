import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Plus, 
  Sparkles, 
  Check,
  Zap
} from "lucide-react";
import API from "../services/api";

export default function AddChore() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy"); // Logic exists in your API
  const [loading, setLoading] = useState(false);

  const handleAddChore = async (e) => {
    e.preventDefault();
    if (!title) return;

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      // Mapping your existing API structure to our new design
      const res = await API.post("/chore/add", {
        title,
        flatId: user.flatId,
        assignedTo: null, // Auto-assignment logic
        difficulty: difficulty,
        dueDate: null,
      });

      // Navigate back to the sanctuary
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add rhythm.");
    } finally {
      setLoading(false);
    }
  };

  const effortLevels = [
    { id: "easy", label: "Light", desc: "Quick & Easy" },
    { id: "medium", label: "Moderate", desc: "Standard task" },
    { id: "hard", label: "Deep", desc: "Takes time" },
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center px-6 pt-12 md:pt-24 selection:bg-protocol-blue/10">
      
      {/* HEADER: Returning to Peace */}
      <div className="w-full max-w-[440px] flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate("/dashboard")}
          className="p-2 -ml-2 text-ink-secondary hover:text-ink-primary transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold text-ink-primary tracking-tight">New Rhythm</h1>
        <div className="w-10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white rounded-[32px] p-8 shadow-soft-smoke border border-border-subtle"
      >
        <form onSubmit={handleAddChore} className="space-y-10">
          
          {/* TASK INPUT */}
          <div>
            <label className="text-[11px] font-bold text-protocol-blue uppercase tracking-[0.2em] mb-4 block">
              What needs doing?
            </label>
            <input 
              autoFocus
              type="text"
              placeholder="e.g. Empty the dishwasher"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-canvas border border-border-subtle rounded-2xl px-6 py-4 text-lg outline-none focus:border-protocol-blue/30 transition-all text-ink-primary placeholder:text-ink-secondary/40"
            />
          </div>

          {/* DIFFICULTY / EFFORT (Mapping to your difficulty field) */}
          <div>
            <label className="text-[11px] font-bold text-ink-secondary uppercase tracking-[0.2em] mb-4 block">
              Effort Level
            </label>
            <div className="space-y-3">
              {effortLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setDifficulty(level.id)}
                  className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
                    difficulty === level.id 
                    ? 'bg-protocol-blue/5 border-protocol-blue/20 ring-1 ring-protocol-blue/10' 
                    : 'bg-white border-border-subtle hover:border-border-subtle/80'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      difficulty === level.id ? 'bg-protocol-blue/10 text-protocol-blue' : 'bg-canvas text-ink-secondary'
                    }`}>
                      <Zap size={18} fill={difficulty === level.id ? "currentColor" : "none"} />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-semibold ${difficulty === level.id ? 'text-ink-primary' : 'text-ink-secondary'}`}>
                        {level.label}
                      </p>
                      <p className="text-[11px] text-ink-secondary/60">{level.desc}</p>
                    </div>
                  </div>
                  {difficulty === level.id && (
                    <div className="w-5 h-5 bg-protocol-blue rounded-full flex items-center justify-center text-white">
                      <Check size={12} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <button 
            type="submit"
            disabled={loading || !title}
            className="w-full bg-protocol-blue text-white py-5 rounded-full font-medium flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-protocol-blue/10 transition-all active:scale-[0.98] disabled:opacity-20"
          >
            {loading ? "Adding..." : "Add to House"}
            {!loading && <Plus size={18} />}
          </button>

        </form>
      </motion.div>

      <p className="mt-8 text-[11px] text-ink-secondary text-center max-w-[240px] leading-relaxed uppercase tracking-wider font-medium opacity-60">
        New rhythms are automatically shared with your roommates.
      </p>
    </div>
  );
}
import { useState } from "react";

export default function ChoreSection({ chores, members, onComplete, onDelete }) {
  const [view, setView] = useState("active");

  const filteredChores = chores.filter((c) => {
    const isDone = c.completed === true; 
    return view === "active" ? !isDone : isDone;
  });

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Chores 🧹</h2>
        <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button 
            onClick={() => setView("active")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'active' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Active
          </button>
          <button 
            onClick={() => setView("history")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'history' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChores.length > 0 ? (
          filteredChores.map((chore) => (
            <div key={chore.choreId} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between min-h-[170px]">
              <div>
                <div className="flex justify-between items-start">
                   <h3 className="text-xl font-semibold text-white">{chore.title}</h3>
                   <button 
                     onClick={() => onDelete(chore.choreId)}
                     className="text-zinc-600 hover:text-red-500 transition-colors text-[10px] font-bold uppercase tracking-wider"
                   >
                     Delete
                   </button>
                </div>
                <p className="text-zinc-500 mt-2 text-sm">
                  Assigned To: {
                    chore.assignedTo
                      ? members.find((u) => u.uid === chore.assignedTo)?.name || "Unknown"
                      : "Unassigned"
                  }
                </p>
              </div>
              {!chore.completed && (
                <button
                  onClick={() => onComplete(chore.choreId)}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-bold shadow-lg"
                >
                  Complete ✅
                </button>
              )}
              {chore.completed && (
                <p className="mt-4 text-xs text-zinc-600 italic">
                  Done at: {chore.completedAt ? new Date(chore.completedAt._seconds * 1000).toLocaleDateString() : 'Recently'}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 bg-zinc-950 rounded-2xl border border-dashed border-zinc-800 flex flex-col items-center justify-center">
            <p className="text-zinc-500 italic">No {view} chores found 😈</p>
          </div>
        )}
      </div>
    </div>
  );
}
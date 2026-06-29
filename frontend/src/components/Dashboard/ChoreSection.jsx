import { useState } from "react";

export default function ChoreSection({
  chores,
  members,
  onComplete,
  onDelete,
  onUpdate,
}) {
  const [view, setView] = useState("active");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    assignedTo: "",
  });

  const startEditing = (chore) => {
    setEditingId(chore.choreId);
    setEditData({
      title: chore.title,
      assignedTo: chore.assignedTo || "",
    });
  };

  const handleSave = async (id) => {
    await onUpdate(id, {
      title: editData.title,
      assignedTo: editData.assignedTo === "" ? null : editData.assignedTo,
    });

    setEditingId(null);
  };

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
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === "active"
                ? "bg-violet-600 text-white"
                : "text-gray-400"
            }`}
          >
            Active
          </button>

          <button
            onClick={() => setView("history")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === "history"
                ? "bg-violet-600 text-white"
                : "text-gray-400"
            }`}
          >
            History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChores.map((chore) => (
          <div
            key={chore.choreId}
            className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between min-h-[180px]"
          >
            {editingId === chore.choreId ? (
              <div className="space-y-3">
                <input
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-violet-500 outline-none text-sm"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      title: e.target.value,
                    })
                  }
                />

                <select
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 outline-none text-sm"
                  value={editData.assignedTo}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      assignedTo: e.target.value,
                    })
                  }
                >
                  <option value="">Unassigned</option>

                  {members.map((m) => (
                    <option key={m.uid} value={m.uid}>
                      {m.name}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(chore.choreId)}
                    className="flex-1 bg-violet-600 py-1 rounded text-xs font-bold"
                  >
                    SAVE
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-zinc-700 py-1 rounded text-xs font-bold"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-white">
                      {chore.title}
                    </h3>

                    <div className="flex gap-2">
                      {!chore.completed && (
                        <button
                          onClick={() => startEditing(chore)}
                          className="text-zinc-600 hover:text-violet-400 text-[10px] font-bold uppercase"
                        >
                          Edit
                        </button>
                      )}

                      <button
                        onClick={() => onDelete(chore.choreId)}
                        className="text-zinc-600 hover:text-red-500 text-[10px] font-bold uppercase"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-zinc-500 mt-2 text-sm">
                    Assigned To:{" "}
                    {chore.assignedTo
                      ? members.find((u) => u.uid === chore.assignedTo)?.name ||
                        "Unknown"
                      : "Unassigned"}
                  </p>
                </div>

                {!chore.completed ? (
                  <button
                    onClick={() => onComplete(chore.choreId)}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold shadow-lg"
                  >
                    Complete ✅
                  </button>
                ) : (
                  <>
                    <p className="mt-4 text-xs text-zinc-600 italic">
                      Done at:{" "}
                      {chore.completedAt
                        ? new Date(
                            chore.completedAt._seconds * 1000
                          ).toLocaleDateString()
                        : "Recently"}
                    </p>

                    <div className="mt-4 pt-4 border-t border-zinc-800 space-y-1">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold">
                        Responsible:{" "}
                        {members.find(
                          (m) => m.uid === chore.assignedTo
                        )?.name || "Unassigned"}
                      </p>

                      <p className="text-[10px] text-green-500 uppercase font-bold">
                        Executed By:{" "}
                        {members.find(
                          (m) => m.uid === chore.completedBy
                        )?.name || "Unknown"}
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        ))}

        {filteredChores.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 italic">
            No {view} chores found 😈
          </div>
        )}
      </div>
    </div>
  );
}
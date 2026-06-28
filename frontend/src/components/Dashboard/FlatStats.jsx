export default function FlatStats({ flatData, onLeave }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
        <h2 className="text-xl font-bold text-gray-400">Flat Name</h2>
        <p className="text-2xl mt-4 font-semibold">{flatData.flatName}</p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
        <h2 className="text-xl font-bold text-gray-400">Invite Code</h2>
        <p className="text-2xl mt-4 font-mono text-violet-400">{flatData.inviteCode}</p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-400">Members</h2>
          <p className="text-2xl mt-4 font-semibold">{flatData.members?.length || 0}</p>
        </div>
        <button 
          onClick={onLeave}
          className="mt-4 text-red-500 hover:text-red-400 text-sm font-bold text-left transition-colors"
        >
          Leave Flat →
        </button>
      </div>
    </div>
  );
}
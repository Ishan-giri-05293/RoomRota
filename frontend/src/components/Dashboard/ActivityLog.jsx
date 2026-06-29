export default function ActivityLog({ events }) {
  const getEmoji = (type) => {
    switch (type) {
      case "CHORE_COMPLETED":
        return "✅";
      case "CHORE_CREATED":
        return "🆕";
      case "MEMBER_JOINED":
        return "👋";
      case "MEMBER_LEFT":
        return "🚪";
      case "CHORE_DELETED":
        return "🗑️";
      case "CHORE_UPDATED":
        return "✏️";
      case "SMART_ASSIGN":
        return "🤖";
      default:
        return "📌";
    }
  };

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        Activity Log 🕒
      </h2>

      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {events.map((event) => (
          <div key={event.eventId || event.id} className="flex gap-4 items-start">
            <div className="text-xl bg-zinc-800 p-2 rounded-lg">
              {getEmoji(event.type)}
            </div>

            <div>
              <p className="text-sm text-zinc-300">
                <span className="font-bold text-white">
                  {event.userName}
                </span>{" "}
                {event.description}
              </p>

              <p className="text-xs text-zinc-500 mt-1">
                {event.createdAt
                  ? new Date(event.createdAt._seconds * 1000).toLocaleString()
                  : "Just now"}
              </p>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <p className="text-zinc-500 italic text-center">
            No recent activity
          </p>
        )}
      </div>
    </div>
  );
}
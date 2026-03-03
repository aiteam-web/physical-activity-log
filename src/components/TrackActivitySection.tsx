import { useState } from "react";

interface Activity {
  id: number;
  emoji: string;
  name: string;
  duration: number;
}

const TrackActivitySection = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [date, setDate] = useState("");
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");

  const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);

  const handleAdd = () => {
    if (!activity || !duration) return;
    const emojis: Record<string, string> = {
      run: "🏃", walk: "🚶", swim: "🏊", bike: "🚴", yoga: "🧘", hike: "🥾",
    };
    const emoji = emojis[activity.toLowerCase()] || "💪";
    setActivities([
      ...activities,
      { id: Date.now(), emoji, name: activity, duration: parseInt(duration) },
    ]);
    setActivity("");
    setDuration("");
    setDate("");
  };

  return (
    <section className="py-16 md:py-24">
      <div className="section-container">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-3">
          📊 Track Your Activity
        </h2>
        <p className="text-muted-foreground text-center text-lg mb-12 max-w-md mx-auto">
          Log your daily activities and watch your progress grow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Activity Log Card */}
          <div className="wellness-card space-y-4">
            <h3 className="font-serif text-xl font-semibold text-foreground">Activity Log</h3>
            <div className="space-y-3">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Date"
              />
              <input
                type="text"
                placeholder="Activity (e.g. Run)"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="number"
                placeholder="Duration (min)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              onClick={handleAdd}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:brightness-110 transition"
            >
              Add Activity
            </button>
          </div>

          {/* Summary Card */}
          <div className="wellness-card-blue space-y-4">
            <h3 className="font-serif text-xl font-semibold text-accent-foreground">
              Your Activities
            </h3>
            <ul className="space-y-3">
              {activities.map((a) => (
                <li key={a.id} className="flex items-center justify-between text-foreground">
                  <span className="text-sm">
                    {a.emoji} {a.name}
                  </span>
                  <span className="text-sm text-muted-foreground">{a.duration} min</span>
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-border flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">{totalMinutes} minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackActivitySection;

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useActivities, type ViewMode } from "@/hooks/useActivities";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

const TrackActivitySection = () => {
  const {
    groupedByDate, stats, chartData, weeklyTrend,
    addActivity, editActivity, deleteActivity,
  } = useActivities();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [filterDate, setFilterDate] = useState<Date | undefined>();
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDuration, setEditDuration] = useState("");

  const handleAdd = () => {
    if (!activity || !duration || !date) return;
    addActivity(format(date, "yyyy-MM-dd"), activity, parseInt(duration), notes || undefined);
    setActivity("");
    setDuration("");
    setNotes("");
  };

  const toggleDate = (d: string) => {
    setExpandedDates(prev => {
      const next = new Set(prev);
      next.has(d) ? next.delete(d) : next.add(d);
      return next;
    });
  };

  const startEdit = (id: string, name: string, dur: number) => {
    setEditingId(id);
    setEditName(name);
    setEditDuration(String(dur));
  };

  const saveEdit = () => {
    if (editingId && editName && editDuration) {
      editActivity(editingId, { name: editName, duration: parseInt(editDuration) });
      setEditingId(null);
    }
  };

  // Filter grouped entries
  const filteredDates = Object.keys(groupedByDate).filter(dateStr => {
    if (!filterDate) return true;
    const d = parseISO(dateStr);
    if (viewMode === "daily") return dateStr === format(filterDate, "yyyy-MM-dd");
    if (viewMode === "weekly") {
      const start = new Date(filterDate);
      start.setDate(start.getDate() - start.getDay() + 1);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return d >= start && d <= end;
    }
    if (viewMode === "monthly") {
      return d.getMonth() === filterDate.getMonth() && d.getFullYear() === filterDate.getFullYear();
    }
    return true;
  });

  return (
    <section className="py-12 md:py-24">
      <div className="section-container">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
          📊 Track Your Activity
        </h2>
        <p className="text-muted-foreground text-center text-base md:text-lg mb-8 md:mb-12 max-w-md mx-auto">
          Log your daily activities and monitor your progress over time.
        </p>

        {/* Entry + Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto mb-8 md:mb-12">
          {/* Activity Entry Card */}
          <div className="wellness-card space-y-3 md:space-y-4">
            <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground">Activity Log</h3>
            <div className="space-y-3">
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10 md:h-11",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>📅 Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <input
                type="text"
                placeholder="🏃 Activity (e.g. Run)"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="number"
                placeholder="⏱ Duration (min)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <textarea
                placeholder="📝 Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <Button onClick={handleAdd} className="w-full rounded-xl h-10 md:h-11 font-semibold">
              Save Activity
            </Button>
          </div>

          {/* Progress Summary Card */}
          <div className="wellness-card-blue space-y-3 md:space-y-4">
            <h3 className="font-serif text-lg md:text-xl font-semibold text-accent-foreground">
              📈 Progress Summary
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="This Week" value={`${stats.weekMinutes} min`} />
              <StatBox label="This Month" value={`${stats.monthMinutes} min`} />
              <StatBox label="Most Frequent" value={stats.mostFrequent} />
              <StatBox label="Longest Session" value={stats.longestSession > 0 ? `${stats.longestSession} min` : "—"} />
            </div>
            <div className="pt-3 border-t border-border/50 flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">🔥 Current Streak</span>
              <span className="text-xl md:text-2xl font-bold text-primary">{stats.streak} day{stats.streak !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto mb-8 md:mb-12">
          <div className="wellness-card">
            <h4 className="font-serif text-base md:text-lg font-semibold text-foreground mb-4">Last 7 Days</h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 25% 90%)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(215 15% 50%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215 15% 50%)" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0 0% 100%)",
                    border: "1px solid hsl(210 25% 90%)",
                    borderRadius: "12px",
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="minutes" fill="hsl(215 85% 55%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="wellness-card">
            <h4 className="font-serif text-base md:text-lg font-semibold text-foreground mb-4">Weekly Trend</h4>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 25% 90%)" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(215 15% 50%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215 15% 50%)" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0 0% 100%)",
                    border: "1px solid hsl(210 25% 90%)",
                    borderRadius: "12px",
                    fontSize: 13,
                  }}
                />
                <Line type="monotone" dataKey="minutes" stroke="hsl(215 85% 55%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(215 85% 55%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity History */}
        <div className="max-w-4xl mx-auto">
          <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-4">📅 Activity History</h3>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex gap-1 rounded-xl bg-muted p-1">
              {(["daily", "weekly", "monthly"] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors capitalize",
                    viewMode === mode ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-xl text-xs md:text-sm">
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {filterDate ? format(filterDate, "PPP") : "Filter by date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filterDate}
                  onSelect={setFilterDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {filterDate && (
              <Button variant="ghost" size="sm" onClick={() => setFilterDate(undefined)} className="text-xs md:text-sm">
                Clear filter
              </Button>
            )}
          </div>

          {/* History cards */}
          <div className="space-y-3">
            {filteredDates.length === 0 && (
              <div className="wellness-card-blue text-center py-8">
                <p className="text-muted-foreground">No activities logged yet. Start tracking above! 🚀</p>
              </div>
            )}
            {filteredDates.map(dateStr => {
              const dayActivities = groupedByDate[dateStr];
              const dayTotal = dayActivities.reduce((s, a) => s + a.duration, 0);
              const isExpanded = expandedDates.has(dateStr);

              return (
                <div key={dateStr} className="wellness-card-blue overflow-hidden">
                  <button
                    onClick={() => toggleDate(dateStr)}
                    className="w-full flex items-center justify-between py-1"
                  >
                    <span className="font-serif text-sm md:text-base font-semibold text-foreground">
                      {format(parseISO(dateStr), "EEEE, MMMM d, yyyy")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-sm text-primary font-bold">{dayTotal} min</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-2 pt-3 border-t border-border/30">
                      {dayActivities.map(a => (
                        <div key={a.id} className="flex items-center justify-between gap-2">
                          {editingId === a.id ? (
                            <div className="flex-1 flex gap-2 items-center flex-wrap">
                              <input
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                className="rounded-lg border border-input bg-background px-2 py-1 text-sm w-24"
                              />
                              <input
                                type="number"
                                value={editDuration}
                                onChange={e => setEditDuration(e.target.value)}
                                className="rounded-lg border border-input bg-background px-2 py-1 text-sm w-20"
                              />
                              <Button size="sm" onClick={saveEdit} className="h-7 text-xs rounded-lg">Save</Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-7 text-xs">Cancel</Button>
                            </div>
                          ) : (
                            <>
                              <span className="text-sm text-foreground">
                                {a.emoji} {a.name}
                                {a.notes && <span className="text-muted-foreground ml-1">— {a.notes}</span>}
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs md:text-sm text-muted-foreground mr-1">{a.duration} min</span>
                                <button onClick={() => startEdit(a.id, a.name, a.duration)} className="p-1 rounded hover:bg-accent transition-colors">
                                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                                <button onClick={() => deleteActivity(a.id)} className="p-1 rounded hover:bg-destructive/10 transition-colors">
                                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      <div className="pt-2 border-t border-border/30 flex justify-between">
                        <span className="text-xs font-medium text-foreground">Daily Total</span>
                        <span className="text-sm font-bold text-primary">{dayTotal} minutes</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatBox = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-card/60 p-3 text-center">
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className="text-base md:text-lg font-bold text-foreground truncate">{value}</p>
  </div>
);

export default TrackActivitySection;

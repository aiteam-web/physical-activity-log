import { useState, useEffect, useCallback, useMemo } from "react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO, subDays, isAfter } from "date-fns";

export interface Activity {
  id: string;
  date: string; // YYYY-MM-DD
  emoji: string;
  name: string;
  duration: number;
  notes?: string;
}

const STORAGE_KEY = "wellness-activities";

const EMOJI_MAP: Record<string, string> = {
  run: "🏃", walk: "🚶", swim: "🏊", bike: "🚴", yoga: "🧘", hike: "🥾",
  dance: "💃", gym: "🏋️", stretch: "🤸", meditation: "🧘",
};

function getEmoji(name: string): string {
  return EMOJI_MAP[name.toLowerCase()] || "💪";
}

function loadActivities(): Activity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveActivities(activities: Activity[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
}

export type ViewMode = "daily" | "weekly" | "monthly";

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>(loadActivities);

  useEffect(() => {
    saveActivities(activities);
  }, [activities]);

  const addActivity = useCallback((date: string, name: string, duration: number, notes?: string) => {
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      date,
      emoji: getEmoji(name),
      name,
      duration,
      notes,
    };
    setActivities(prev => [...prev, newActivity]);
  }, []);

  const editActivity = useCallback((id: string, updates: Partial<Omit<Activity, "id">>) => {
    setActivities(prev =>
      prev.map(a => a.id === id ? { ...a, ...updates, emoji: updates.name ? getEmoji(updates.name) : a.emoji } : a)
    );
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  }, []);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Activity[]> = {};
    activities
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach(a => {
        if (!groups[a.date]) groups[a.date] = [];
        groups[a.date].push(a);
      });
    return groups;
  }, [activities]);

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const thisWeek = activities.filter(a => {
      const d = parseISO(a.date);
      return isWithinInterval(d, { start: weekStart, end: weekEnd });
    });

    const thisMonth = activities.filter(a => {
      const d = parseISO(a.date);
      return isWithinInterval(d, { start: monthStart, end: monthEnd });
    });

    const weekMinutes = thisWeek.reduce((s, a) => s + a.duration, 0);
    const monthMinutes = thisMonth.reduce((s, a) => s + a.duration, 0);

    // Most frequent activity
    const freq: Record<string, number> = {};
    activities.forEach(a => { freq[a.name] = (freq[a.name] || 0) + 1; });
    const mostFrequent = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    // Longest session
    const longestSession = activities.length > 0
      ? Math.max(...activities.map(a => a.duration))
      : 0;

    // Current streak
    let streak = 0;
    const activeDays = new Set(activities.map(a => a.date));
    let checkDate = now;
    // If today has no activity, start from yesterday
    if (!activeDays.has(format(checkDate, "yyyy-MM-dd"))) {
      checkDate = subDays(checkDate, 1);
    }
    while (activeDays.has(format(checkDate, "yyyy-MM-dd"))) {
      streak++;
      checkDate = subDays(checkDate, 1);
    }

    return { weekMinutes, monthMinutes, mostFrequent, longestSession, streak };
  }, [activities]);

  // Chart data (last 7 days)
  const chartData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(now, 6 - i);
      const dateStr = format(date, "yyyy-MM-dd");
      const dayActivities = activities.filter(a => a.date === dateStr);
      const minutes = dayActivities.reduce((s, a) => s + a.duration, 0);
      return { day: format(date, "EEE"), date: dateStr, minutes };
    });
  }, [activities]);

  // Weekly trend (last 4 weeks)
  const weeklyTrend = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 4 }, (_, i) => {
      const weekEnd = subDays(now, i * 7);
      const weekStart = subDays(weekEnd, 6);
      const weekActivities = activities.filter(a => {
        const d = parseISO(a.date);
        return isWithinInterval(d, { start: weekStart, end: weekEnd });
      });
      const minutes = weekActivities.reduce((s, a) => s + a.duration, 0);
      return { week: `W${4 - i}`, minutes };
    }).reverse();
  }, [activities]);

  // Filter helpers
  const filterByDate = useCallback((dateStr: string) => {
    return activities.filter(a => a.date === dateStr);
  }, [activities]);

  const filterByWeek = useCallback((date: Date) => {
    const ws = startOfWeek(date, { weekStartsOn: 1 });
    const we = endOfWeek(date, { weekStartsOn: 1 });
    return activities.filter(a => isWithinInterval(parseISO(a.date), { start: ws, end: we }));
  }, [activities]);

  const filterByMonth = useCallback((date: Date) => {
    const ms = startOfMonth(date);
    const me = endOfMonth(date);
    return activities.filter(a => isWithinInterval(parseISO(a.date), { start: ms, end: me }));
  }, [activities]);

  return {
    activities,
    groupedByDate,
    stats,
    chartData,
    weeklyTrend,
    addActivity,
    editActivity,
    deleteActivity,
    filterByDate,
    filterByWeek,
    filterByMonth,
  };
}

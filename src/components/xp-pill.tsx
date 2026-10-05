"use client";

import { Flame, Star } from "lucide-react";
import { rankFor } from "@/lib/gamification";
import { useProgress } from "@/lib/storage";

export function XpPill() {
  const [progress] = useProgress();
  if (!progress) return <div className="ml-2 h-7 w-24 animate-pulse rounded-full bg-muted" />;
  const rank = rankFor(progress.xp);
  return (
    <div className="ml-2 flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold shadow-sm">
      <Star className="size-3.5 fill-amber-400 text-amber-500" />
      <span>{progress.xp.toLocaleString()} XP</span>
      <span className="hidden text-muted-foreground sm:inline">· {rank.name}</span>
      {progress.streakDays > 0 && (
        <span className="flex items-center gap-0.5 text-orange-600">
          <Flame className="size-3.5" />
          {progress.streakDays}
        </span>
      )}
    </div>
  );
}

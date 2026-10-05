"use client";

import { Flame, Lock, Star } from "lucide-react";
import { BADGES, rankFor } from "@/lib/gamification";
import type { StudentProgress } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProgressPanel({ progress, compact = false }: { progress: StudentProgress; compact?: boolean }) {
  const rank = rankFor(progress.xp);
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-accent/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your rank</p>
          <p className="text-2xl font-bold tracking-tight">{rank.name}</p>
          <p className="text-xs text-muted-foreground">
            {rank.band} band · Rank {rank.index + 1} of 9
          </p>
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end gap-1 text-xl font-bold">
            <Star className="size-5 fill-amber-400 text-amber-500" /> {progress.xp.toLocaleString()}
          </p>
          <p className="flex items-center justify-end gap-1 text-xs text-orange-600">
            <Flame className="size-3.5" /> {progress.streakDays} day streak
          </p>
        </div>
      </div>
      <div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-fuchsia-500 transition-all duration-700" style={{ width: `${Math.max(3, rank.progress * 100)}%` }} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {rank.next ? `${(rank.next - progress.xp).toLocaleString()} XP to the next rank` : "Top rank reached"}
        </p>
      </div>
      {!compact && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Badges · {progress.badges.length}/{BADGES.length}
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {BADGES.map((b) => {
              const earned = progress.badges.includes(b.id);
              return (
                <div
                  key={b.id}
                  title={`${b.name}: ${b.description}`}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border text-center",
                    earned ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950" : "border-border bg-muted/50 text-muted-foreground",
                  )}
                >
                  <span className={cn("text-2xl", !earned && "grayscale opacity-40")}>{earned ? b.icon : <Lock className="size-5" />}</span>
                  <span className="line-clamp-1 px-1 text-[10px] font-medium leading-tight">{b.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

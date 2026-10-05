"use client";

import { toast } from "sonner";
import type { AwardResult } from "@/lib/gamification";
import { rankFor } from "@/lib/gamification";

/** Surface newly earned badges and rank-ups as toasts. */
export function announce(result: AwardResult) {
  for (const b of result.newBadges) {
    toast(`${b.icon} Badge unlocked: ${b.name}`, { description: b.description, duration: 5000 });
  }
  if (result.rankedUp) {
    const rank = rankFor(result.progress.xp);
    toast.success(`Rank up! You are now a ${rank.name}`, { description: `${rank.band} band · keep going`, duration: 6000 });
  }
}

export function Stars({ count, size = "text-2xl" }: { count: number; size?: string }) {
  return (
    <span className={`${size} leading-none tracking-tight`} aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < count ? "text-foreground" : "text-muted-foreground/30"}>
          ★
        </span>
      ))}
    </span>
  );
}

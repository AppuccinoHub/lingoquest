import { ACTFL_LEVELS } from "./actfl";
import { loadProgress, saveProgress } from "./storage";
import type { GameResult, StudentProgress } from "./types";

/** XP needed to reach each rank. Ranks borrow their names from the ACTFL sublevels. */
export const RANK_THRESHOLDS = [0, 150, 400, 800, 1400, 2200, 3300, 4800, 7000];

export interface Rank {
  index: number;
  name: string;
  short: string;
  band: string;
  current: number;
  next: number | null;
  progress: number;
}

export function rankFor(xp: number): Rank {
  let index = 0;
  for (let i = 0; i < RANK_THRESHOLDS.length; i++) if (xp >= RANK_THRESHOLDS[i]) index = i;
  const level = ACTFL_LEVELS[Math.min(index, ACTFL_LEVELS.length - 1)];
  const current = RANK_THRESHOLDS[index];
  const next = RANK_THRESHOLDS[index + 1] ?? null;
  const progress = next ? Math.min(1, (xp - current) / (next - current)) : 1;
  return { index, name: level.rank, short: level.short, band: level.band, current, next, progress };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: (p: StudentProgress) => boolean;
}

export const BADGES: Badge[] = [
  { id: "first-words", name: "First Words", description: "Complete your first speaking attempt", icon: "🎤", earned: (p) => p.speakAttempts >= 1 },
  { id: "brave-voice", name: "Brave Voice", description: "25 speaking attempts. Speaking is a muscle.", icon: "🦁", earned: (p) => p.speakAttempts >= 25 },
  { id: "unstoppable", name: "Unstoppable", description: "100 speaking attempts", icon: "🚀", earned: (p) => p.speakAttempts >= 100 },
  { id: "combo-5", name: "Combo Starter", description: "Hit a 5× combo in Vocab Blitz", icon: "⚡", earned: (p) => p.bestCombo >= 5 },
  { id: "combo-10", name: "Combo Master", description: "Hit a 10× combo in Vocab Blitz", icon: "🔥", earned: (p) => p.bestCombo >= 10 },
  { id: "streak-3", name: "Three-Day Streak", description: "Play three days in a row", icon: "📅", earned: (p) => p.streakDays >= 3 },
  { id: "streak-7", name: "Week Warrior", description: "Play seven days in a row", icon: "🏆", earned: (p) => p.streakDays >= 7 },
  { id: "polyglot-100", name: "Centurion", description: "Earn 100 XP", icon: "💯", earned: (p) => p.xp >= 100 },
  { id: "polyglot-1000", name: "Thousand Club", description: "Earn 1,000 XP", icon: "💎", earned: (p) => p.xp >= 1000 },
  {
    id: "triple-threat",
    name: "Triple Threat",
    description: "Play all three games on one lesson",
    icon: "🎯",
    earned: (p) => Object.values(p.games).some((g) => g.speak && g.blitz && g.scramble),
  },
  {
    id: "can-do",
    name: "I Can!",
    description: "Check off a Can-Do statement",
    icon: "✅",
    earned: (p) => Object.values(p.canDoChecked).some((arr) => arr.length > 0),
  },
];

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export interface AwardResult {
  progress: StudentProgress;
  newBadges: Badge[];
  rankedUp: boolean;
}

/**
 * Apply XP and game stats, update the streak, and compute newly earned badges.
 */
export function award(
  update: {
    xp: number;
    lessonId?: string;
    game?: string;
    score?: number;
    speakAttempts?: number;
    combo?: number;
  },
): AwardResult {
  const before = loadProgress();
  const beforeRank = rankFor(before.xp).index;
  const today = todayKey();

  let streakDays = before.streakDays;
  if (before.lastPlayedDay !== today) {
    streakDays = before.lastPlayedDay === yesterdayKey() ? before.streakDays + 1 : 1;
  }

  const games = { ...before.games };
  if (update.lessonId && update.game) {
    const lessonGames = { ...(games[update.lessonId] ?? {}) };
    const prev: GameResult = lessonGames[update.game] ?? { bestScore: 0, plays: 0, lastPlayedAt: 0 };
    lessonGames[update.game] = {
      bestScore: Math.max(prev.bestScore, update.score ?? 0),
      plays: prev.plays + 1,
      lastPlayedAt: Date.now(),
    };
    games[update.lessonId] = lessonGames;
  }

  const next: StudentProgress = {
    ...before,
    xp: before.xp + Math.max(0, Math.round(update.xp)),
    streakDays,
    lastPlayedDay: today,
    speakAttempts: before.speakAttempts + (update.speakAttempts ?? 0),
    bestCombo: Math.max(before.bestCombo, update.combo ?? 0),
    games,
  };

  const newBadges = BADGES.filter((b) => !before.badges.includes(b.id) && b.earned(next));
  next.badges = [...before.badges, ...newBadges.map((b) => b.id)];
  saveProgress(next);
  return { progress: next, newBadges, rankedUp: rankFor(next.xp).index > beforeRank };
}

export function toggleCanDo(lessonId: string, index: number): AwardResult {
  const before = loadProgress();
  const current = before.canDoChecked[lessonId] ?? [];
  const checked = current.includes(index) ? current.filter((i) => i !== index) : [...current, index];
  const next: StudentProgress = { ...before, canDoChecked: { ...before.canDoChecked, [lessonId]: checked } };
  const newBadges = BADGES.filter((b) => !before.badges.includes(b.id) && b.earned(next));
  next.badges = [...before.badges, ...newBadges.map((b) => b.id)];
  saveProgress(next);
  return { progress: next, newBadges, rankedUp: false };
}

export function resetProgress() {
  saveProgress({ xp: 0, streakDays: 0, lastPlayedDay: null, badges: [], speakAttempts: 0, bestCombo: 0, games: {}, canDoChecked: {} });
}

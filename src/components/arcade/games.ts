import { Mic, Shuffle, Zap, type LucideIcon } from "lucide-react";

interface GameDef {
  id: "speak" | "blitz" | "scramble";
  name: string;
  tagline: string;
  icon: LucideIcon;
  color: string;
  xp: string;
  scoreLabel: (n: number) => string;
}

export const GAMES: GameDef[] = [
  {
    id: "speak",
    name: "Speak Quest",
    tagline: "Say words and sentences to your device. Speech recognition scores you privately.",
    icon: Mic,
    color: "bg-secondary text-foreground",
    xp: "10–30 XP per prompt",
    scoreLabel: (n) => `${n}% best match`,
  },
  {
    id: "blitz",
    name: "Vocab Blitz",
    tagline: "60 seconds. Tap the right word. Build a combo.",
    icon: Zap,
    color: "bg-muted text-foreground",
    xp: "5 XP × combo",
    scoreLabel: (n) => `${n} pts best`,
  },
  {
    id: "scramble",
    name: "Sentence Scramble",
    tagline: "Rebuild the lesson's sentences from shuffled chunks, then read them aloud.",
    icon: Shuffle,
    color: "bg-accent text-accent-foreground",
    xp: "15 XP per sentence",
    scoreLabel: (n) => `${n} pts best`,
  },
];

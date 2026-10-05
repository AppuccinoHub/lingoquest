import type { ActflLevelId, Mode, Skill } from "./actfl";

export interface VocabItem {
  term: string;
  translation: string;
}

export interface Lesson {
  id: string;
  title: string;
  languageId: string;
  level: ActflLevelId;
  /** Thematic unit, e.g. "Food & meals" */
  theme: string;
  essentialQuestion: string;
  canDo: string[];
  vocabulary: VocabItem[];
  /** Model sentences students should be able to say or recognise */
  sentences: string[];
  /** Grammar or functional chunks, e.g. "me gusta + noun" */
  structures: string[];
  cultureNote: string;
  createdAt: number;
  updatedAt: number;
}

export type MaterialCategory =
  | "warm-up"
  | "interpretive"
  | "interpersonal"
  | "presentational"
  | "game"
  | "assessment"
  | "culture"
  | "homework"
  | "arcade";

export interface Material {
  id: string;
  title: string;
  category: MaterialCategory;
  modes: Mode[];
  skills: Skill[];
  minutes: number;
  groupSize: "individual" | "pairs" | "small groups" | "whole class";
  description: string;
  steps: string[];
  differentiation?: string;
  canDo: string;
  tip?: string;
  /** Optional link into the student arcade */
  arcadeHref?: string;
  /** Reduces speaking anxiety (private, low-stakes, or playful) */
  lowAnxiety?: boolean;
}

export interface GameResult {
  bestScore: number;
  plays: number;
  lastPlayedAt: number;
}

export interface StudentProgress {
  xp: number;
  streakDays: number;
  lastPlayedDay: string | null;
  badges: string[];
  speakAttempts: number;
  bestCombo: number;
  games: Record<string, Record<string, GameResult>>;
  /** lessonId -> indexes of Can-Do statements the student marked as "I can" */
  canDoChecked: Record<string, number[]>;
}

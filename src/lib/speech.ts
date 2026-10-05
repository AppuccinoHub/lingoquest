"use client";

import { useSyncExternalStore } from "react";

/* Minimal typings for the Web Speech API, which TypeScript's DOM lib does not include. */
interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly 0: { transcript: string; confidence: number };
}
interface SpeechRecognitionEventLike extends Event {
  readonly resultIndex: number;
  readonly results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionErrorEventLike extends Event {
  readonly error: string;
}
export interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

export function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function speechRecognitionSupported(): boolean {
  return getRecognitionCtor() !== null;
}

/**
 * Listen for a single utterance and resolve with the final transcript.
 * Rejects with the Web Speech error code when recognition fails.
 */
export function recognizeOnce(lang: string, onInterim?: (text: string) => void): { promise: Promise<string>; stop: () => void } {
  const Ctor = getRecognitionCtor();
  let rec: SpeechRecognitionLike | null = null;
  const promise = new Promise<string>((resolve, reject) => {
    if (!Ctor) {
      reject(new Error("unsupported"));
      return;
    }
    rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    let finalText = "";
    let failed = false;
    rec.onresult = (ev) => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      onInterim?.(finalText || interim);
    };
    rec.onerror = (ev) => {
      failed = true;
      reject(new Error(ev.error));
    };
    rec.onend = () => {
      if (!failed) resolve(finalText.trim());
    };
    try {
      rec.start();
    } catch {
      reject(new Error("start-failed"));
    }
  });
  return { promise, stop: () => rec?.stop() };
}

export function speak(text: string, lang: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.9;
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\p{P}\p{S}]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string[], b: string[]): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[m][n];
}

/**
 * Similarity between what the student said and the target, 0..1.
 * Uses word-level edit distance for spaced languages and character-level otherwise.
 */
export function similarity(said: string, target: string, noSpaces = false): number {
  const a = normalize(said);
  const b = normalize(target);
  if (!a || !b) return 0;
  const ta = noSpaces ? Array.from(a.replace(/ /g, "")) : a.split(" ");
  const tb = noSpaces ? Array.from(b.replace(/ /g, "")) : b.split(" ");
  const dist = levenshtein(ta, tb);
  return Math.max(0, 1 - dist / Math.max(ta.length, tb.length));
}

const ARTICLES = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas", // es
  "le", "les", "l", "une", "des", "du", // fr
  "der", "die", "das", "den", "dem", "ein", "eine", "einen", // de
  "il", "lo", "gli", "i", "uno", // it
  "o", "a", "os", "as", "um", "uma", // pt
  "the", "an", // en
]);

/** Drop a leading article so "el pan" also matches "como pan". */
function coreTerm(normalized: string): string {
  const parts = normalized.split(" ");
  return parts.length > 1 && ARTICLES.has(parts[0]) ? parts.slice(1).join(" ") : normalized;
}

/** How many target vocabulary terms appear in a free response. */
export function vocabHits(said: string, terms: string[], noSpaces = false): string[] {
  const s = normalize(said);
  if (!s) return [];
  return terms.filter((t) => {
    const n = normalize(t);
    if (!n) return false;
    if (noSpaces) return s.replace(/ /g, "").includes(n.replace(/ /g, ""));
    const core = coreTerm(n);
    return s.includes(n) || ` ${s} `.includes(` ${core} `);
  });
}

export function starsFor(score: number): 0 | 1 | 2 | 3 {
  if (score >= 0.85) return 3;
  if (score >= 0.6) return 2;
  if (score >= 0.35) return 1;
  return 0;
}

const noopSubscribe = () => () => {};

/** SSR-safe hook: false on the server, real capability on the client. */
export function useSpeechSupported(): boolean {
  return useSyncExternalStore(noopSubscribe, speechRecognitionSupported, () => false);
}

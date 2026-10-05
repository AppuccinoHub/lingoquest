"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { DEMO_LESSON } from "./demo-lesson";
import type { Lesson, StudentProgress } from "./types";

const LESSONS_KEY = "lingoquest.lessons.v1";
const PROGRESS_KEY = "lingoquest.progress.v1";

export const EMPTY_PROGRESS: StudentProgress = {
  xp: 0,
  streakDays: 0,
  lastPlayedDay: null,
  badges: [],
  speakAttempts: 0,
  bestCombo: 0,
  games: {},
  canDoChecked: {},
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("lingoquest:storage", { detail: key }));
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
}

export function loadLessons(): Lesson[] {
  return read<Lesson[]>(LESSONS_KEY, []);
}

export function saveLesson(lesson: Lesson): Lesson[] {
  const lessons = loadLessons();
  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const next = idx >= 0 ? lessons.map((l) => (l.id === lesson.id ? lesson : l)) : [lesson, ...lessons];
  write(LESSONS_KEY, next);
  return next;
}

export function deleteLesson(id: string): Lesson[] {
  const next = loadLessons().filter((l) => l.id !== id);
  write(LESSONS_KEY, next);
  return next;
}

export function findLesson(id: string): Lesson | undefined {
  if (id === DEMO_LESSON.id) return DEMO_LESSON;
  return loadLessons().find((l) => l.id === id);
}

export function allLessonsWithDemo(): Lesson[] {
  return [...loadLessons(), DEMO_LESSON];
}

export function loadProgress(): StudentProgress {
  return { ...EMPTY_PROGRESS, ...read<Partial<StudentProgress>>(PROGRESS_KEY, {}) };
}

export function saveProgress(p: StudentProgress) {
  write(PROGRESS_KEY, p);
}

function subscribe(callback: () => void) {
  window.addEventListener("lingoquest:storage", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("lingoquest:storage", callback);
    window.removeEventListener("storage", callback);
  };
}

function rawSnapshot(): string {
  return `${window.localStorage.getItem(LESSONS_KEY) ?? ""}\u0000${window.localStorage.getItem(PROGRESS_KEY) ?? ""}`;
}

const getServerSnapshot = () => undefined;

/**
 * Subscribe to a storage-backed value. Returns `undefined` during server
 * rendering and hydration so callers can render a loading state.
 */
export function useStored<T>(loader: () => T, key = ""): [T | undefined, () => void] {
  const cache = useRef<{ raw: string; value: T } | null>(null);
  const getSnapshot = useCallback(() => {
    const raw = key + "\u0000" + rawSnapshot();
    if (cache.current && cache.current.raw === raw) return cache.current.value;
    const value = loader();
    cache.current = { raw, value };
    return value;
  }, [loader, key]);
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const refresh = useCallback(() => {
    cache.current = null;
    window.dispatchEvent(new CustomEvent("lingoquest:storage"));
  }, []);
  return [value, refresh];
}

export function useLessons() {
  return useStored(loadLessons);
}

export function useProgress() {
  return useStored(loadProgress);
}

/** Encode a lesson into a URL-safe string so students can open it on their own device. */
export function encodeLessonForShare(lesson: Lesson): string {
  const json = JSON.stringify(lesson);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeSharedLesson(encoded: string): Lesson | null {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "="));
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    const lesson = JSON.parse(new TextDecoder().decode(bytes)) as Lesson;
    if (!lesson?.id || !lesson.title || !Array.isArray(lesson.vocabulary)) return null;
    return lesson;
  } catch {
    return null;
  }
}

const FLASH_KEY = "lingoquest.flash";

/** Queue a one-time message to be shown by the next page after a navigation. */
export function setFlash(message: string) {
  window.sessionStorage.setItem(FLASH_KEY, message);
}

export function takeFlash(): string | null {
  const msg = window.sessionStorage.getItem(FLASH_KEY);
  if (msg) window.sessionStorage.removeItem(FLASH_KEY);
  return msg;
}

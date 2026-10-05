import { findSample } from "@/lib/samples"
import type { LessonInput } from "@/lib/types"

const LESSON_KEY = "cando-arcade-lessons-v1"
const PROGRESS_KEY = "cando-arcade-progress-v1"

export type Progress = {
  xp: number
  completed: string[]
  badges: string[]
  voiceUsed: boolean
}

const EMPTY_PROGRESS: Progress = { xp: 0, completed: [], badges: [], voiceUsed: false }

export function newId() {
  return `lesson-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function blankLesson(): LessonInput {
  return {
    id: newId(),
    title: "",
    language: "Spanish",
    level: "Novice High",
    topic: "",
    objective: "",
    vocabulary: "",
    grammar: "",
    culture: "",
    notes: "",
    updatedAt: Date.now(),
  }
}

export function loadLessons(): LessonInput[] {
  const lessons = readJson<LessonInput[]>(LESSON_KEY, [])
  return lessons.sort((a, b) => b.updatedAt - a.updatedAt)
}

export function saveLesson(lesson: LessonInput) {
  const rest = loadLessons().filter((item) => item.id !== lesson.id)
  const next = [{ ...lesson, updatedAt: Date.now() }, ...rest].slice(0, 24)
  writeJson(LESSON_KEY, next)
}

export function deleteLesson(id: string) {
  writeJson(
    LESSON_KEY,
    loadLessons().filter((lesson) => lesson.id !== id),
  )
}

export function getLesson(id: string): LessonInput | null {
  const sample = findSample(id)
  if (sample) return { ...sample }
  return loadLessons().find((lesson) => lesson.id === id) ?? null
}

export function readProgress(lessonId: string): Progress {
  const all = readJson<Record<string, Progress>>(PROGRESS_KEY, {})
  return all[lessonId] ?? EMPTY_PROGRESS
}

export function award(
  lessonId: string,
  materialId: string,
  xp: number,
  badges: string[] = [],
  voice = false,
) {
  const all = readJson<Record<string, Progress>>(PROGRESS_KEY, {})
  const prev = all[lessonId] ?? EMPTY_PROGRESS
  const already = prev.completed.includes(materialId)
  const gain = already ? Math.min(8, xp) : xp
  const next: Progress = {
    xp: prev.xp + gain,
    completed: already ? prev.completed : [...prev.completed, materialId],
    badges: [...new Set([...prev.badges, ...badges])],
    voiceUsed: prev.voiceUsed || voice,
  }
  all[lessonId] = next
  writeJson(PROGRESS_KEY, all)
  return { progress: next, gain, already }
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
}

import { bandOf, canDosFor, descriptorFor, textTypeFor } from "@/lib/actfl"
import { packFor, type LangPack, type TemplateKey } from "@/lib/languages"
import type { Band, CanDos, LessonInput, Vocab } from "@/lib/types"
import { isContentWord, parseVocab } from "@/lib/vocab"

export type Ctx = {
  lesson: LessonInput
  vocab: Vocab[]
  content: Vocab[]
  pool: Vocab[]
  band: Band
  pack: LangPack
  topic: string
  grammar: string
  culture: string
  objective: string
  canDos: CanDos
  descriptor: string
  textType: string
  rng: () => number
  partner: string
}

export function makeContext(lesson: LessonInput): Ctx | null {
  const topic = lesson.topic.trim()
  if (topic.length < 2) return null

  const vocab = parseVocab(lesson.vocabulary)
  const content = vocab.filter(isContentWord)
  const pool = content.length >= 2 ? content : vocab.length ? vocab : [{ term: topic, gloss: topic }]
  const band = bandOf(lesson.level)
  const pack = packFor(lesson.language)

  return {
    lesson,
    vocab,
    content,
    pool,
    band,
    pack,
    topic,
    grammar:
      lesson.grammar.trim() ||
      (band === "Novice"
        ? "memorized phrases and high-frequency words"
        : band === "Intermediate"
          ? "sentences students create, plus a follow-up question"
          : "paragraph-length narration with a complication"),
    culture: lesson.culture.trim() || `how people usually handle ${topic}`,
    objective: lesson.objective.trim(),
    canDos: canDosFor(topic, band),
    descriptor: descriptorFor(lesson.level),
    textType: textTypeFor(band),
    rng: mulberry32(hash(`${lesson.id}|${topic}|${lesson.level}|${lesson.vocabulary}|${lesson.language}`)),
    partner: partnerRole(topic),
  }
}

export function at(ctx: Ctx, index: number) {
  return ctx.pool[index % ctx.pool.length]
}

export function fill(template: string, item: string) {
  return template.replaceAll("{item}", item)
}

export function line(ctx: Ctx, key: TemplateKey, index: number) {
  return fill(ctx.pack[key], at(ctx, index).term)
}

export function labelOf(item: Vocab) {
  return item.gloss || item.term
}

export function shuffle<T>(items: T[], rng: () => number) {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

export function unique(items: string[]) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of items) {
    const key = item.toLowerCase()
    if (!item || seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

export function bankFor(ctx: Ctx, model: string, index: number) {
  const fromModel = model.split(/\s+/).filter((word) => word.replace(/[^\p{L}\p{N}]/gu, "").length > 1)
  const extras = [at(ctx, index + 1).term, at(ctx, index + 2).term, ctx.pack.please, ctx.pack.thanks]
  return unique([...fromModel, ...extras]).slice(0, 8)
}

export function meaningOf(ctx: Ctx, key: TemplateKey, index: number) {
  const item = labelOf(at(ctx, index))
  const map: Record<TemplateKey, string> = {
    like: `I like ${item}`,
    want: `I want ${item}`,
    have: `I have ${item}`,
    howMuch: `How much is ${item}?`,
    where: `Where is ${item}?`,
    invite: `Do you want ${item}?`,
    problem: `There is no ${item}`,
    opinion: `I think ${item} is better`,
    yesterday: `Yesterday I got ${item}`,
    questionLike: `Do you like ${item}?`,
  }
  return map[key]
}

function partnerRole(topic: string) {
  const text = topic.toLowerCase()
  if (/market|shop|buy|food|store|restaurant|café|cafe|menu/.test(text)) return "the vendor"
  if (/school|class|week|schedule/.test(text)) return "a classmate"
  if (/meet|greet|name|introduc|hello/.test(text)) return "someone you just met"
  return "a partner in the scene"
}

function hash(value: string) {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let state = seed
  return function rng() {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

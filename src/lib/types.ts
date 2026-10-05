export const LEVELS = [
  "Novice Low",
  "Novice Mid",
  "Novice High",
  "Intermediate Low",
  "Intermediate Mid",
  "Intermediate High",
  "Advanced Low",
  "Advanced Mid",
  "Advanced High",
] as const

export type Level = (typeof LEVELS)[number]
export type Band = "Novice" | "Intermediate" | "Advanced"
export type Mode = "Interpretive" | "Interpersonal" | "Presentational"
export type StandardC =
  | "Communication"
  | "Cultures"
  | "Connections"
  | "Comparisons"
  | "Communities"
export type Spotlight = "private" | "mask" | "pair" | "chorus" | "quiet"

export type LessonInput = {
  id: string
  title: string
  language: string
  level: Level
  topic: string
  objective: string
  vocabulary: string
  grammar: string
  culture: string
  notes: string
  updatedAt: number
}

export type Vocab = { term: string; gloss: string }

export type SprintQuestion = {
  prompt: string
  options: string[]
  answer: string
  hint: string
}

export type SayTurn = {
  scene: string
  task: string
  model: string
  meaning: string
  bank: string[]
  focus: string
  gloss: string
}

export type ForgeLine = {
  meaning: string
  chips: string[]
  answer: string[]
  model: string
}

export type ChorusLine = {
  call: string
  response: string
  meaning: string
}

export type MaskPlay = {
  name: string
  role: string
  turns: SayTurn[]
}

export type TicketQuestion =
  | { kind: "choice"; prompt: string; options: string[]; answer: string }
  | { kind: "pulse"; prompt: string; options: string[] }

export type WhisperCard = {
  front: string
  back: string
  meaning: string
}

export type PlayData =
  | { type: "sprint"; questions: SprintQuestion[] }
  | { type: "mission"; intro: string; bankOn: boolean; turns: SayTurn[] }
  | { type: "forge"; lines: ForgeLine[] }
  | { type: "chorus"; lines: ChorusLine[] }
  | { type: "mask"; intro: string; bankOn: boolean; masks: MaskPlay[] }
  | { type: "ticket"; questions: TicketQuestion[] }
  | { type: "cards"; cards: WhisperCard[] }

export type HandoutBlock =
  | { kind: "list"; title: string; items: string[] }
  | { kind: "table"; title: string; columns: [string, string]; rows: [string, string][] }
  | { kind: "note"; text: string }

export type Material = {
  id: string
  title: string
  hook: string
  kind: PlayData["type"] | "plan"
  mode: Mode
  cs: StandardC[]
  canDo: string
  minutes: number
  spotlight: Spotlight
  playable: boolean
  quick: boolean
  xp: number
  whySafe: string
  steps: string[]
  support: string
  stretch: string
  handout: HandoutBlock[]
  play?: PlayData
}

export type CanDos = {
  interpretive: string
  interpersonal: string
  presentational: string
}

export type Deck = {
  canDos: CanDos
  band: Band
  descriptor: string
  textType: string
  materials: Material[]
}

export const CAMPAIGN_IDS = [
  "word-sprint",
  "line-forge",
  "chorus",
  "whisper-cards",
  "mask-quest",
  "pip-mission",
  "exit-ticket",
] as const

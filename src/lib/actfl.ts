import type { Band, CanDos, Level, Mode, Spotlight, StandardC } from "@/lib/types"

export function bandOf(level: Level): Band {
  if (level.startsWith("Novice")) return "Novice"
  if (level.startsWith("Intermediate")) return "Intermediate"
  return "Advanced"
}

const DESCRIPTORS: Record<Level, string> = {
  "Novice Low": "Isolated words. Learners point, name, and repeat practiced language.",
  "Novice Mid": "More words and memorized phrases. Lists and formulaic replies carry the message.",
  "Novice High": "Practiced phrases and some short sentences. A new sentence may stall halfway.",
  "Intermediate Low": "Original sentences in familiar situations. The message lands, even if the form is uneven.",
  "Intermediate Mid": "Strings of sentences. Learners ask, answer, and keep a simple exchange moving.",
  "Intermediate High": "Connected sentences most of the time, including when a small complication shows up.",
  "Advanced Low": "Paragraph-length speech. Learners narrate, describe, and deal with an unexpected snag.",
  "Advanced Mid": "Organized paragraphs across time frames, with detail a listener can follow.",
  "Advanced High": "Extended discourse that usually holds together, even when the situation turns.",
}

const TEXT_TYPE: Record<Band, string> = {
  Novice: "Words, phrases, and memorized chunks",
  Intermediate: "Sentences and strings of sentences",
  Advanced: "Paragraphs that narrate and describe",
}

export function descriptorFor(level: Level) {
  return DESCRIPTORS[level]
}

export function textTypeFor(band: Band) {
  return TEXT_TYPE[band]
}

export function canDosFor(topic: string, band: Band): CanDos {
  if (band === "Novice") {
    return {
      interpretive: `I can recognize familiar words and phrases about ${topic}.`,
      interpersonal: `I can answer simple questions about ${topic} with words and practiced phrases.`,
      presentational: `I can name and list information about ${topic} using language I have practiced.`,
    }
  }
  if (band === "Intermediate") {
    return {
      interpretive: `I can understand the main idea and some details in short texts about ${topic}.`,
      interpersonal: `I can ask and answer questions about ${topic} and keep a short conversation going.`,
      presentational: `I can give a series of sentences about ${topic} that someone else can follow.`,
    }
  }
  return {
    interpretive: `I can follow detailed accounts about ${topic}, including when something goes wrong.`,
    interpersonal: `I can maintain a conversation about ${topic} and handle a complication.`,
    presentational: `I can narrate and describe ${topic} with enough detail to tell a full story.`,
  }
}

export const MODE_COPY: Record<Mode, { hint: string; color: string; soft: string }> = {
  Interpretive: {
    hint: "Understand what you read, hear, or view.",
    color: "#2457c5",
    soft: "#e7eefc",
  },
  Interpersonal: {
    hint: "Exchange ideas and negotiate meaning with someone.",
    color: "#b4335a",
    soft: "#fde8ee",
  },
  Presentational: {
    hint: "Present information to an audience, prepared ahead of time.",
    color: "#9a5b09",
    soft: "#f8edd8",
  },
}

export const C_COPY: Record<StandardC, string> = {
  Communication: "The three modes: interpretive, interpersonal, presentational.",
  Cultures: "Practices and products, and the perspectives behind them.",
  Connections: "Other subjects, and information only available in the language.",
  Comparisons: "How this language and culture compare with the ones students already know.",
  Communities: "Use beyond the classroom, with people and for a real purpose.",
}

export const SPOTLIGHT_COPY: Record<Spotlight, { label: string; detail: string }> = {
  private: {
    label: "Just you and Pip",
    detail: "Speech stays on the device. The class never hears it.",
  },
  mask: {
    label: "Behind a character",
    detail: "The character talks. The student does not have to be themselves.",
  },
  pair: {
    label: "One partner",
    detail: "Whisper to a single person while the rest of the room does the same.",
  },
  chorus: {
    label: "Everyone at once",
    detail: "No solo. If someone freezes, the room carries the line.",
  },
  quiet: {
    label: "Pencil first",
    detail: "Writing, matching, or listening. Voice is optional.",
  },
}

export const RANKS = [
  { xp: 0, name: "Ticket stub", blurb: "You walked in." },
  { xp: 40, name: "Regular", blurb: "The words are starting to stick." },
  { xp: 100, name: "High score", blurb: "You can build a line and say it." },
  { xp: 180, name: "House player", blurb: "You can carry a short scene." },
  { xp: 280, name: "Closing crew", blurb: "You kept the arcade open." },
] as const

export function rankFor(xp: number) {
  let current: (typeof RANKS)[number] = RANKS[0]
  for (const rank of RANKS) {
    if (xp >= rank.xp) current = rank
  }
  const next = RANKS.find((rank) => rank.xp > xp) ?? null
  return { current, next }
}

export const BADGES: Record<string, { name: string; detail: string }> = {
  "first-voice": { name: "First voice", detail: "You used the mic. Only this device heard it." },
  "quiet-start": { name: "Quiet start", detail: "You cleared Word Sprint before anyone asked you to talk." },
  "line-maker": { name: "Line maker", detail: "You built sentences, then said them on your own terms." },
  "in-chorus": { name: "In the chorus", detail: "You said the lines with everyone, not alone." },
  "whisper-ok": { name: "Whisper pass", detail: "You practiced the lines one card at a time." },
  "mask-on": { name: "Mask on", detail: "A character did the talking." },
  "pip-trust": { name: "Pip's trust", detail: "You finished a private conversation." },
  "pulse-check": { name: "Pulse check", detail: "You told the truth about how ready you feel." },
  combo: { name: "Combo", detail: "Five matches in a row, still with no one watching." },
}

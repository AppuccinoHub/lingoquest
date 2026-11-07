import { ACTFL_LEVELS, LANGUAGES, type ActflLevelId } from "./actfl";
import type { Lesson, VocabItem } from "./types";

/** Lesson fields a generator must return. Ids and timestamps are assigned here on save. */
export interface LessonDraft {
  title: string;
  languageId: string;
  level: ActflLevelId;
  theme: string;
  essentialQuestion: string;
  canDo: string[];
  vocabulary: VocabItem[];
  sentences: string[];
  structures: string[];
  cultureNote: string;
}

export type DraftResult = { ok: true; draft: LessonDraft } | { ok: false; errors: string[] };

const LEVEL_BY_LABEL = new Map<string, ActflLevelId>(
  ACTFL_LEVELS.flatMap((level) => [
    [level.id, level.id],
    [level.label.toLowerCase(), level.id],
  ]),
);

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function textList(value: unknown, label: string, errors: string[]): string[] {
  if (!Array.isArray(value)) {
    errors.push(`${label} should be a list.`);
    return [];
  }
  return value.map(text).filter(Boolean);
}

function matchLanguage(value: string): string | null {
  const lowered = value.trim().toLowerCase();
  return LANGUAGES.find((language) => language.id === lowered || language.name.toLowerCase() === lowered)?.id ?? null;
}

function readVocab(value: unknown, errors: string[]): VocabItem[] {
  if (!Array.isArray(value)) {
    errors.push("Vocabulary should be a list of words with English meanings.");
    return [];
  }
  const items: VocabItem[] = [];
  value.forEach((entry, index) => {
    const place = index + 1;
    if (typeof entry === "string") {
      const [term, ...rest] = entry.split(/\s*(?:=|:|\t|\s-\s|—)\s*/);
      const translation = rest.join(" ").trim();
      if (!term?.trim() || !translation) {
        errors.push(`Vocabulary item ${place} needs the word and an English meaning, like "un caffè = an espresso".`);
        return;
      }
      items.push({ term: term.trim(), translation });
      return;
    }
    const record = asRecord(entry);
    if (!record) {
      errors.push(`Vocabulary item ${place} needs the word and an English meaning.`);
      return;
    }
    const term = text(record.term ?? record.word);
    const translation = text(record.translation ?? record.english ?? record.meaning);
    if (!term || !translation) {
      errors.push(`Vocabulary item ${place}${term ? ` (${term})` : ""} needs both the word and an English meaning.`);
      return;
    }
    items.push({ term, translation });
  });
  return items;
}

/**
 * Turns model or pasted JSON into a lesson draft.
 * Only lesson fields are kept. Ids, timestamps, and anything about students are dropped.
 */
export function parseLessonDraft(input: unknown): DraftResult {
  const record = asRecord(input);
  if (!record) return { ok: false, errors: ["The lesson needs to be a JSON object."] };

  const errors: string[] = [];
  const title = text(record.title);
  if (!title) errors.push("The lesson needs a title.");

  const languageRaw = text(record.languageId ?? record.language);
  const languageId = languageRaw ? matchLanguage(languageRaw) : null;
  if (!languageId) errors.push('Say which language, for example "it" for Italian.');

  const levelRaw = text(record.level).toLowerCase();
  const level = LEVEL_BY_LABEL.get(levelRaw) ?? null;
  if (!level) errors.push('Use a level such as "novice-mid".');

  const theme = text(record.theme ?? record.topic);
  if (!theme) errors.push("The lesson needs a topic or theme.");

  const essentialQuestion = text(record.essentialQuestion ?? record.essential_question ?? record.question);
  if (!essentialQuestion) errors.push("The lesson needs an essential question.");

  const canDo = textList(record.canDo ?? record.goals, "Goals", errors);
  if (canDo.length < 2) errors.push("Add at least two goals, each starting with “I can”.");

  const vocabulary = readVocab(record.vocabulary ?? record.vocab, errors);
  if (vocabulary.length < 3) errors.push("Add at least three vocabulary items, with an English meaning for each.");

  const sentences = textList(record.sentences ?? record.modelSentences, "Model sentences", errors);
  if (sentences.length < 2) errors.push("Add at least two model sentences in the target language.");

  const structures = textList(record.structures ?? record.chunks ?? record.functionalChunks, "Structures", errors);
  if (structures.length < 1) errors.push("Add at least one structure or functional chunk.");

  const cultureNote = text(record.cultureNote ?? record.culture);
  if (!cultureNote) errors.push("Add a culture note.");

  if (errors.length || !languageId || !level) return { ok: false, errors };

  return {
    ok: true,
    draft: { title, languageId, level, theme, essentialQuestion, canDo, vocabulary, sentences, structures, cultureNote },
  };
}

export function draftToLesson(draft: LessonDraft, now = Date.now()): Lesson {
  const id = Math.random().toString(36).slice(2, 8) + now.toString(36).slice(-4);
  return { ...draft, id, createdAt: now, updatedAt: now };
}

/** Pull a lesson object out of a backend response. Validation happens after this. */
export function unwrapLessonPayload(data: unknown): unknown {
  if (typeof data === "string") return parseJsonObject(data);
  const record = asRecord(data);
  if (!record) return data;
  if (typeof record.response === "string") return parseJsonObject(record.response);
  const choice = Array.isArray(record.choices) ? asRecord(record.choices[0]) : null;
  const message = choice ? asRecord(choice.message) : null;
  if (message && typeof message.content === "string") return parseJsonObject(message.content);
  if (record.lesson) return record.lesson;
  return record;
}

function parseJsonObject(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
}

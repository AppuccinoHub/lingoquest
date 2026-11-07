export const DEFAULT_MODEL = "@cf/mistralai/mistral-small-3.1-24b-instruct";

export const SYSTEM_PROMPT = `You write one world-language lesson for a teacher. Return only a JSON object, with no markdown, using exactly these fields:
{"title":"","languageId":"","level":"","theme":"","essentialQuestion":"","canDo":["I can ..."],"vocabulary":[{"term":"","translation":""}],"sentences":[""],"structures":[""],"cultureNote":""}

languageId and level must be the codes from the user message. level is one of novice-low, novice-mid, novice-high, intermediate-low, intermediate-mid, intermediate-high, advanced-low, advanced-mid, advanced-high.
Fill every field. Include at least six vocabulary items, four model sentences, three structures, and three goals.
Put the article in the vocabulary term when the language uses articles, and put the English meaning in translation.
Model sentences must use those words.
If the language is Italian, use correct accents (caffè, tè, perché, è, più). Teach vorrei only as a fixed polite chunk, Vorrei…, not as conditional conjugation. Indefinite articles are un and un'.
In the culture note, do not use absolutes such as always or never. Describe what often happens and say that routines vary by place.
Goals are student-facing "I can..." statements for this topic. Do not claim ACTFL endorsement. Do not say a speech-match score establishes proficiency.
Do not include student names, scores, progress, or class lists.`;

export const GUIDED_JSON = {
  type: "object",
  properties: {
    title: { type: "string" },
    languageId: { type: "string" },
    level: { type: "string" },
    theme: { type: "string" },
    essentialQuestion: { type: "string" },
    canDo: { type: "array", items: { type: "string" } },
    vocabulary: {
      type: "array",
      items: {
        type: "object",
        properties: { term: { type: "string" }, translation: { type: "string" } },
        required: ["term", "translation"],
      },
    },
    sentences: { type: "array", items: { type: "string" } },
    structures: { type: "array", items: { type: "string" } },
    cultureNote: { type: "string" },
  },
  required: ["title", "languageId", "level", "theme", "essentialQuestion", "canDo", "vocabulary", "sentences", "structures", "cultureNote"],
};

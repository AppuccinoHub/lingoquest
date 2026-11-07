import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { readFileSync } from "node:fs";
import { generateLesson, NOT_SET_UP, TEACHER_TOKEN_HEADER } from "../src/lib/generate-lesson";
import { parseLessonDraft } from "../src/lib/lesson-draft";
import { generateMaterials } from "../src/lib/generator";
import { saveLesson } from "../src/lib/storage";

const cafe = JSON.parse(readFileSync(new URL("../docs/examples/cafe-al-bar.example.json", import.meta.url), "utf8"));
const conto = {
  title: "Il conto: asking the price and saying thanks",
  languageId: "it",
  level: "novice-mid",
  theme: "Paying at an Italian café",
  essentialQuestion: "Come chiedo il prezzo e il conto?",
  canDo: [
    "I can ask the price of something I want.",
    "I can ask for the bill with a memorized phrase.",
    "I can thank the staff.",
  ],
  vocabulary: [
    { term: "il prezzo", translation: "the price" },
    { term: "il conto", translation: "the bill" },
    { term: "la cassa", translation: "the cash desk" },
    { term: "il resto", translation: "the change" },
    { term: "uno scontrino", translation: "a receipt" },
  ],
  sentences: ["Quant'è il caffè?", "Il conto, per favore.", "Grazie, va bene così."],
  structures: ["Quant'è…? (How much is…?)", "Il conto, per favore (The bill, please)", "Grazie (Thank you)"],
  cultureNote: "Some cafés take payment at la cassa before you drink, and others settle il conto afterward. The routine often depends on the place, so it is fine to ask.",
};

async function main() {
function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("no port");
      resolve(address.port);
    });
  });
}

const calls: { body: unknown; token: string | undefined }[] = [];
const script: Array<"cafe" | "conto" | "bad"> = [];

const server = createServer((req, res) => {
  const origin = req.headers.origin ?? "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Teacher-Token");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  const chunks: Buffer[] = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    calls.push({ body, token: req.headers[TEACHER_TOKEN_HEADER.toLowerCase()] as string | undefined });
    const step = script.shift() ?? "cafe";
    const lesson = step === "conto" ? conto : cafe;
    const payload = step === "bad" ? { response: "this is not json" } : { response: JSON.stringify(lesson) };
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(payload));
  });
});

const port = await listen(server);
const endpoint = `http://127.0.0.1:${port}/`;

const missing = await generateLesson({
  topic: "caffè",
  level: "novice-mid",
  languageId: "it",
  endpoint: "",
  teacherToken: "",
});
assert.equal(missing.ok, false);
if (!missing.ok) assert.equal(missing.error, NOT_SET_UP);

const example = parseLessonDraft(cafe);
assert.equal(example.ok, true, example.ok ? "" : example.errors.join(" "));

script.push("cafe");
const first = await generateLesson({
  topic: "Al bar",
  level: "novice-mid",
  languageId: "it",
  endpoint,
  teacherToken: "pass-phrase",
});
assert.equal(first.ok, true, first.ok ? "" : first.error);
if (!first.ok) throw new Error("unreachable");
assert.equal(first.lesson.vocabulary.some((item) => item.term === "un caffè"), true);
assert.equal(first.lesson.sentences.includes("Vorrei un cornetto, per favore."), true);
assert.notEqual(first.lesson.id, "");
assert.equal(calls[0]?.token, "pass-phrase");
assert.deepEqual(Object.keys(calls[0]?.body as object).sort(), ["languageId", "level", "topic"]);
const materials = generateMaterials(first.lesson);
assert.equal(materials.some((material) => JSON.stringify(material).includes("Vorrei un cornetto, per favore.")), true);

script.push("bad", "conto");
const before = calls.length;
const retried = await generateLesson({
  topic: "Il conto",
  level: "novice-mid",
  languageId: "it",
  endpoint,
  teacherToken: "pass-phrase",
});
assert.equal(calls.length, before + 2);
assert.equal(retried.ok, true, retried.ok ? "" : retried.error);
if (!retried.ok) throw new Error("unreachable");
assert.equal(retried.lesson.title, conto.title);
assert.notEqual(retried.lesson.id, first.lesson.id);
assert.equal(retried.lesson.vocabulary.some((item) => item.term === "la cassa"), true);

script.push("bad", "bad");
const failed = await generateLesson({
  topic: "Al bar",
  level: "novice-mid",
  languageId: "it",
  endpoint,
  teacherToken: "pass-phrase",
});
assert.equal(failed.ok, false);

const memory = new Map<string, string>();
const storage = {
  getItem: (key: string) => memory.get(key) ?? null,
  setItem: (key: string, value: string) => {
    memory.set(key, value);
  },
};
Object.assign(globalThis, {
  window: { localStorage: storage, dispatchEvent() {} },
});
memory.set("lingoquest.progress.v1", JSON.stringify({ xp: 40, badges: ["kept"] }));
saveLesson(first.lesson);
saveLesson(retried.lesson);
const saved = JSON.parse(memory.get("lingoquest.lessons.v1") ?? "[]") as { id: string }[];
assert.deepEqual(saved.map((lesson) => lesson.id), [retried.lesson.id, first.lesson.id]);
assert.equal(memory.get("lingoquest.progress.v1"), JSON.stringify({ xp: 40, badges: ["kept"] }));

server.close();
console.log("generate tests passed");
}

main();

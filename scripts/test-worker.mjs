import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import worker from "../worker/src/index.js";

const source = readFileSync(new URL("../worker/src/index.js", import.meta.url), "utf8");
const prompt = readFileSync(new URL("../worker/src/prompt.js", import.meta.url), "utf8");
assert.equal(/openai|gemini|gpt-/i.test(source + prompt), false);

class MemoryKV {
  constructor() {
    this.store = new Map();
  }
  async get(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  async put(key, value) {
    this.store.set(key, String(value));
  }
}

function env(overrides = {}) {
  return {
    TEACHER_ACCESS_TOKEN: "pass-phrase",
    LIMITS: new MemoryKV(),
    AI: { async run() { return { response: '{"title":"x"}' }; } },
    ...overrides,
  };
}

function post(body, headers = {}) {
  return new Request("https://worker.test/generate", {
    method: "POST",
    headers: {
      Origin: "https://appuccinohub.github.io",
      "Content-Type": "application/json",
      "X-Teacher-Token": "pass-phrase",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

const lessonBody = { topic: "Al bar", level: "novice-mid", languageId: "it" };

const missingPass = await worker.fetch(post(lessonBody), env({ TEACHER_ACCESS_TOKEN: "" }));
assert.equal(missingPass.status, 503);

const calls = [];
const ai = {
  async run(model, input) {
    calls.push({ model, input });
    return { response: "not json at all" };
  },
};
const unparsed = await worker.fetch(post(lessonBody), env({ AI: ai }));
assert.equal(unparsed.status, 200);
assert.equal(await unparsed.text(), "not json at all");
assert.equal(calls[0].model, "@cf/mistralai/mistral-small-3.1-24b-instruct");
assert.equal(calls[0].input.max_tokens, 3500);
assert.equal(calls[0].input.messages[1].content.includes("student"), false);
assert.equal(calls[0].input.messages[1].content.includes("Al bar"), true);
assert.ok(calls[0].input.guided_json);

const noToken = await worker.fetch(post(lessonBody, { "X-Teacher-Token": "" }), env({ AI: ai }));
assert.equal(noToken.status, 401);
assert.equal(calls.length, 1);

const wrongOrigin = await worker.fetch(post(lessonBody, { Origin: "https://evil.example" }), env());
assert.equal(wrongOrigin.status, 403);

const student = await worker.fetch(post({ ...lessonBody, progress: { xp: 9 } }), env());
assert.equal(student.status, 400);
assert.match(await student.text(), /student information/);

const longTopic = await worker.fetch(post({ ...lessonBody, topic: "c".repeat(201) }), env());
assert.equal(longTopic.status, 400);

const limited = env({ DAILY_REQUEST_CAP: "1", AI: ai });
const first = await worker.fetch(post(lessonBody), limited);
assert.equal(first.status, 200);
const second = await worker.fetch(post({ ...lessonBody, topic: "Il conto" }), limited);
assert.equal(second.status, 429);

const hourly = env({ RATE_LIMIT_PER_WINDOW: "1", AI: ai });
assert.equal((await worker.fetch(post(lessonBody), hourly)).status, 200);
assert.equal((await worker.fetch(post(lessonBody), hourly)).status, 429);

const noKv = await worker.fetch(post(lessonBody), env({ LIMITS: undefined }));
assert.equal(noKv.status, 503);

console.log("worker tests passed");

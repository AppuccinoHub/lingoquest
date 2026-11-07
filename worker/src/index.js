import { DEFAULT_MODEL, GUIDED_JSON, SYSTEM_PROMPT } from "./prompt.js";

const ALLOWED_ORIGIN = "https://appuccinohub.github.io";
const TOKEN_HEADER = "x-teacher-token";
const LEVELS = new Set([
  "novice-low",
  "novice-mid",
  "novice-high",
  "intermediate-low",
  "intermediate-mid",
  "intermediate-high",
  "advanced-low",
  "advanced-mid",
  "advanced-high",
]);
const ALLOWED_FIELDS = new Set(["topic", "level", "languageId"]);

function cors(origin) {
  if (origin !== ALLOWED_ORIGIN) return {};
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Teacher-Token",
    Vary: "Origin",
  };
}

function json(status, origin, error) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "content-type": "application/json", ...cors(origin) },
  });
}

function timingSafeEqual(a, b) {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  const length = Math.max(left.length, right.length);
  let diff = left.length === right.length ? 0 : 1;
  for (let i = 0; i < length; i++) diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  return diff === 0;
}

function numberSetting(value, fallback, ceiling) {
  const parsed = value == null || value === "" ? fallback : Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return null;
  return Math.min(parsed, ceiling);
}

async function sha256(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function count(kv, key) {
  const raw = await kv.get(key);
  const value = raw ? Number(raw) : 0;
  return Number.isFinite(value) ? value : 0;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    if (request.method === "OPTIONS") {
      if (origin !== ALLOWED_ORIGIN) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: cors(origin) });
    }
    if (origin && origin !== ALLOWED_ORIGIN) return json(403, null, "This connection only answers the LingoQuest site.");
    if (request.method !== "POST") return json(405, origin, "Use POST.");

    const passcode = env.TEACHER_ACCESS_TOKEN ?? "";
    if (!passcode) return json(503, origin, "The teacher passcode is not set on the connection yet.");
    const presented = request.headers.get(TOKEN_HEADER) ?? "";
    if (!presented || !timingSafeEqual(presented, passcode)) return json(401, origin, "That teacher passcode was not accepted.");

    if (!env.LIMITS) return json(503, origin, "The daily cap storage is not set up yet.");
    if (!env.AI || typeof env.AI.run !== "function") return json(503, origin, "Workers AI is not connected yet.");

    const dailyCap = numberSetting(env.DAILY_REQUEST_CAP, 30, 30);
    const rateLimit = numberSetting(env.RATE_LIMIT_PER_WINDOW, 10, 30);
    const windowSeconds = numberSetting(env.RATE_LIMIT_WINDOW_SECONDS, 3600, 86400);
    const maxBody = numberSetting(env.MAX_BODY_BYTES, 2000, 4000);
    const maxTopic = numberSetting(env.MAX_TOPIC_LENGTH, 200, 200);
    const maxTokens = numberSetting(env.MAX_OUTPUT_TOKENS, 3500, 3500);
    if (!dailyCap || !rateLimit || !windowSeconds || !maxBody || !maxTopic || !maxTokens) {
      return json(503, origin, "The free-plan limits are not configured.");
    }

    const raw = await request.text();
    if (raw.length > maxBody) return json(400, origin, "That request is too long. Send only a topic and a level.");
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return json(400, origin, "Send a topic and a level as JSON.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) return json(400, origin, "Send a topic and a level as JSON.");
    for (const key of Object.keys(body)) {
      if (!ALLOWED_FIELDS.has(key)) return json(400, origin, "Send only a topic, a level, and a language. Do not send student information.");
    }
    const topic = typeof body.topic === "string" ? body.topic.trim() : "";
    const level = typeof body.level === "string" ? body.level.trim() : "";
    const languageId = typeof body.languageId === "string" ? body.languageId.trim() : "";
    if (!topic) return json(400, origin, "Enter a topic first.");
    if (topic.length > maxTopic) return json(400, origin, "That topic is too long.");
    if (!LEVELS.has(level)) return json(400, origin, "Use a level such as novice-mid.");
    if (!/^[a-z-]{1,16}$/.test(languageId)) return json(400, origin, "Use a short language code such as it.");

    const now = Date.now();
    const day = new Date(now).toISOString().slice(0, 10);
    const bucket = Math.floor(now / (windowSeconds * 1000));
    const tokenHash = (await sha256(presented)).slice(0, 16);
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const dailyKey = `d:${day}`;
    const tokenKey = `t:${tokenHash}:${bucket}`;
    const ipKey = `i:${ip}:${bucket}`;
    const [usedToday, usedToken, usedIp] = await Promise.all([count(env.LIMITS, dailyKey), count(env.LIMITS, tokenKey), count(env.LIMITS, ipKey)]);
    if (usedToday >= dailyCap) return json(429, origin, "Today's free limit has been reached. Try again tomorrow.");
    if (usedToken >= rateLimit || usedIp >= rateLimit) return json(429, origin, "Too many lessons were requested just now. Wait and try again.");

    const dayTtl = Math.max(60, 86400 - Math.floor((now % 86400000) / 1000) + 3600);
    await Promise.all([
      env.LIMITS.put(dailyKey, String(usedToday + 1), { expirationTtl: dayTtl }),
      env.LIMITS.put(tokenKey, String(usedToken + 1), { expirationTtl: windowSeconds }),
      env.LIMITS.put(ipKey, String(usedIp + 1), { expirationTtl: windowSeconds }),
    ]);

    let result;
    try {
      result = await env.AI.run(env.AI_MODEL || DEFAULT_MODEL, {
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Topic: ${topic}\nLevel: ${level}\nLanguage: ${languageId}` },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
        guided_json: GUIDED_JSON,
      });
    } catch {
      return json(502, origin, "The free model did not answer. Try Generate again in a minute.");
    }

    const text = typeof result?.response === "string" ? result.response : JSON.stringify(result?.response ?? "");
    if (!text.trim()) return json(502, origin, "The free model returned nothing. Try Generate again.");
    return new Response(text, {
      status: 200,
      headers: { "content-type": "application/json; charset=utf-8", ...cors(origin) },
    });
  },
};

import { draftToLesson, parseLessonDraft, unwrapLessonPayload, type LessonDraft } from "./lesson-draft";
import type { Lesson } from "./types";
import type { ActflLevelId } from "./actfl";

export const TEACHER_TOKEN_HEADER = "X-Teacher-Token";
export const NOT_SET_UP = "AI connection not set up yet";

export interface GenerateInput {
  topic: string;
  level: ActflLevelId;
  languageId: string;
  endpoint: string;
  teacherToken: string;
  fetchImpl?: typeof fetch;
}

export type GenerateResult = { ok: true; lesson: Lesson } | { ok: false; error: string };

/**
 * Asks whatever lesson backend is saved in Settings for one new lesson.
 * The app does not choose a model. It posts the topic and level, then checks the JSON here.
 */
export async function generateLesson(input: GenerateInput): Promise<GenerateResult> {
  const endpoint = input.endpoint.trim();
  const teacherToken = input.teacherToken.trim();
  if (!endpoint || !teacherToken) return { ok: false, error: NOT_SET_UP };

  const topic = input.topic.trim();
  if (!topic) return { ok: false, error: "Enter a topic first." };

  const attempt = () => requestDraft(input, endpoint, teacherToken, topic);
  const first = await attempt();
  if (first.ok) return { ok: true, lesson: draftToLesson(first.draft) };
  if (!first.retry) return { ok: false, error: first.error };

  const second = await attempt();
  if (second.ok) return { ok: true, lesson: draftToLesson(second.draft) };
  return { ok: false, error: second.error };
}

type Attempt = { ok: true; draft: LessonDraft } | { ok: false; error: string; retry: boolean };

async function requestDraft(input: GenerateInput, endpoint: string, teacherToken: string, topic: string): Promise<Attempt> {
  const fetchImpl = input.fetchImpl ?? fetch;
  let response: Response;
  try {
    response = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [TEACHER_TOKEN_HEADER]: teacherToken,
      },
      body: JSON.stringify({
        topic,
        level: input.level,
        languageId: input.languageId,
      }),
    });
  } catch {
    return { ok: false, retry: false, error: "Couldn't reach the AI connection. Check the address in Connection." };
  }

  if (!response.ok) {
    const message = await friendlyHttpError(response);
    return { ok: false, retry: false, error: message };
  }

  let payload: unknown;
  try {
    payload = unwrapLessonPayload(await response.json());
  } catch {
    return { ok: false, retry: true, error: "The connection didn't return a lesson we could read. Try Generate again." };
  }

  const parsed = parseLessonDraft(payload);
  if (!parsed.ok) {
    return { ok: false, retry: true, error: parsed.errors[0] ?? "The lesson was missing some fields. Try Generate again." };
  }
  return { ok: true, draft: parsed.draft };
}

async function friendlyHttpError(response: Response): Promise<string> {
  if (response.status === 401) return "That teacher passcode was not accepted.";
  if (response.status === 429) return "Today's free limit has been reached. Wait and try again later.";
  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body.error === "string" && body.error.length < 180) return body.error;
  } catch {
    // The status is enough.
  }
  return "The AI connection returned an error. Try Generate again.";
}

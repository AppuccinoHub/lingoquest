"use client";

import { useSyncExternalStore } from "react";

const KEY = "lingoquest.ai.v1";

export interface AiSettings {
  workerUrl: string;
  teacherToken: string;
}

export const EMPTY_AI_SETTINGS: AiSettings = { workerUrl: "", teacherToken: "" };

export function readAiSettings(storage: Pick<Storage, "getItem">): AiSettings {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return EMPTY_AI_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AiSettings>;
    return {
      workerUrl: typeof parsed.workerUrl === "string" ? parsed.workerUrl : "",
      teacherToken: typeof parsed.teacherToken === "string" ? parsed.teacherToken : "",
    };
  } catch {
    return EMPTY_AI_SETTINGS;
  }
}

export function writeAiSettings(storage: Pick<Storage, "setItem">, settings: AiSettings) {
  storage.setItem(
    KEY,
    JSON.stringify({
      workerUrl: settings.workerUrl.trim(),
      teacherToken: settings.teacherToken.trim(),
    }),
  );
}

export function connectionReady(settings: AiSettings): boolean {
  return settings.workerUrl.trim() !== "" && settings.teacherToken.trim() !== "";
}

function subscribe(callback: () => void) {
  window.addEventListener("lingoquest:ai", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("lingoquest:ai", callback);
    window.removeEventListener("storage", callback);
  };
}

let cacheRaw = "";
let cacheValue = EMPTY_AI_SETTINGS;

function snapshot(): AiSettings {
  const raw = window.localStorage.getItem(KEY) ?? "";
  if (raw === cacheRaw) return cacheValue;
  cacheRaw = raw;
  cacheValue = readAiSettings(window.localStorage);
  return cacheValue;
}

export function useAiSettings(): AiSettings {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY_AI_SETTINGS);
}

export function saveAiSettings(settings: AiSettings) {
  writeAiSettings(window.localStorage, settings);
  window.dispatchEvent(new Event("lingoquest:ai"));
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { ACTFL_LEVELS, LANGUAGES, type ActflLevelId } from "@/lib/actfl";
import { connectionReady, saveAiSettings, useAiSettings } from "@/lib/ai-settings";
import { NOT_SET_UP, generateLesson } from "@/lib/generate-lesson";
import { LEVEL_COUNTS } from "@/lib/generator";
import { draftToLesson, parseLessonDraft, unwrapLessonPayload } from "@/lib/lesson-draft";
import { teacherLessonPath } from "@/lib/paths";
import { saveLesson, setFlash } from "@/lib/storage";

export function GeneratePanel() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<ActflLevelId>("novice-mid");
  const [languageId, setLanguageId] = useState("it");
  const saved = useAiSettings();
  const [workerUrl, setWorkerUrl] = useState<string | null>(null);
  const [teacherToken, setTeacherToken] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importText, setImportText] = useState("");
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const shownUrl = workerUrl ?? saved.workerUrl;
  const shownToken = teacherToken ?? saved.teacherToken;
  const ready = connectionReady(saved);

  function saveConnection() {
    saveAiSettings({ workerUrl: shownUrl, teacherToken: shownToken });
    setWorkerUrl(null);
    setTeacherToken(null);
    toast.success(connectionReady({ workerUrl: shownUrl, teacherToken: shownToken }) ? "Connection saved on this device." : "Connection cleared.");
  }

  async function onGenerate() {
    setError(null);
    if (!ready) return;
    setPending(true);
    const result = await generateLesson({ topic, level, languageId, endpoint: saved.workerUrl, teacherToken: saved.teacherToken });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    saveLesson(result.lesson);
    setFlash(`Generated ${LEVEL_COUNTS[result.lesson.level]} materials for ${result.lesson.title}.`);
    router.push(teacherLessonPath(result.lesson.id));
  }

  function acceptDraft(raw: string) {
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      setImportErrors(["That is not JSON. Paste the whole lesson, including the curly braces."]);
      return;
    }
    const parsed = parseLessonDraft(unwrapLessonPayload(data));
    if (!parsed.ok) {
      setImportErrors(parsed.errors);
      return;
    }
    const lesson = draftToLesson(parsed.draft);
    saveLesson(lesson);
    setFlash(`Imported ${lesson.title}. Materials are ready.`);
    router.push(teacherLessonPath(lesson.id));
  }

  const label = !ready ? NOT_SET_UP : pending ? "Generating lesson…" : "Generate lesson";

  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Generate a lesson</CardTitle>
          <CardDescription>Enter a topic and a level. Generate saves a new lesson on this device. Lessons and student progress you already have stay put.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="topic">Topic</Label>
            <Input id="topic" value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Ordering at an Italian café" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="gen-level">Level</Label>
              <NativeSelect id="gen-level" value={level} onChange={(event) => setLevel(event.target.value as ActflLevelId)} className="w-full">
                {ACTFL_LEVELS.map((item) => (
                  <NativeSelectOption key={item.id} value={item.id}>
                    {item.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gen-language">Language</Label>
              <NativeSelect id="gen-language" value={languageId} onChange={(event) => setLanguageId(event.target.value)} className="w-full">
                {LANGUAGES.map((item) => (
                  <NativeSelectOption key={item.id} value={item.id}>
                    {item.flag} {item.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          </div>
          {error && (
            <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
              {error}
            </p>
          )}
          <Button className="h-10" onClick={onGenerate} disabled={!ready || pending}>
            {label}
          </Button>
          <details className="text-sm text-muted-foreground">
            <summary className="cursor-pointer font-medium text-foreground">Import lesson JSON</summary>
            <div className="mt-3 grid gap-2">
              <Textarea value={importText} onChange={(event) => setImportText(event.target.value)} rows={5} placeholder="Paste a lesson JSON object" className="font-mono text-xs" />
              <input
                type="file"
                accept="application/json,.json"
                className="text-xs"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  void file.text().then((text) => setImportText(text));
                }}
              />
              {importErrors.length > 0 && (
                <ul role="alert" className="space-y-1 text-xs text-amber-800 dark:text-amber-200">
                  {importErrors.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              <Button type="button" variant="outline" className="h-9" onClick={() => acceptDraft(importText)}>
                Import as a new lesson
              </Button>
            </div>
          </details>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connection</CardTitle>
          <CardDescription>Paste the address of your free lesson connection and the teacher passcode. The passcode stays on this device. Student progress is not sent.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="worker-url">Connection address</Label>
            <Input id="worker-url" value={shownUrl} onChange={(event) => setWorkerUrl(event.target.value)} placeholder="https://lingoquest-generate.example.workers.dev" inputMode="url" autoComplete="off" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="teacher-token">Teacher passcode</Label>
            <Input id="teacher-token" type="password" value={shownToken} onChange={(event) => setTeacherToken(event.target.value)} autoComplete="off" />
          </div>
          <Button type="button" variant="outline" className="h-9" onClick={saveConnection}>
            Save connection
          </Button>
          {!ready && <p className="text-sm text-muted-foreground">Generate stays off until both fields are saved.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

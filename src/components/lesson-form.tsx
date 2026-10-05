"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, RotateCcw, Save, Wand2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ACTFL_LEVELS, LANGUAGES, getLevel, suggestCanDo, type ActflLevelId } from "@/lib/actfl";
import { LEVEL_COUNTS } from "@/lib/generator";
import { newId, saveLesson } from "@/lib/storage";
import type { Lesson, VocabItem } from "@/lib/types";

interface Props {
  initial?: Lesson;
}

const STARTER_VOCAB = `la manzana = the apple
el pan = the bread
el queso = the cheese`;

function parseVocab(text: string): VocabItem[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [term, ...rest] = line.split(/\s*(?:=|:|\t|\s-\s|—)\s*/);
      return { term: term.trim(), translation: rest.join(" ").trim() };
    })
    .filter((v) => v.term);
}

function vocabToText(items: VocabItem[]): string {
  return items.map((v) => (v.translation ? `${v.term} = ${v.translation}` : v.term)).join("\n");
}

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function LessonForm({ initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [languageId, setLanguageId] = useState(initial?.languageId ?? "es");
  const [level, setLevel] = useState<ActflLevelId>(initial?.level ?? "novice-mid");
  const [theme, setTheme] = useState(initial?.theme ?? "");
  const [essentialQuestion, setEssentialQuestion] = useState(initial?.essentialQuestion ?? "");
  const [canDo, setCanDo] = useState<string[]>(initial?.canDo ?? suggestCanDo("novice-mid"));
  const [vocabText, setVocabText] = useState(initial ? vocabToText(initial.vocabulary) : "");
  const [sentencesText, setSentencesText] = useState(initial?.sentences.join("\n") ?? "");
  const [structuresText, setStructuresText] = useState(initial?.structures.join("\n") ?? "");
  const [cultureNote, setCultureNote] = useState(initial?.cultureNote ?? "");
  const [saving, setSaving] = useState(false);

  const vocab = useMemo(() => parseVocab(vocabText), [vocabText]);
  const sentences = useMemo(() => linesToArray(sentencesText), [sentencesText]);
  const levelInfo = getLevel(level);

  const errors: string[] = [];
  if (!title.trim()) errors.push("Give the lesson a title.");
  if (vocab.length < 3) errors.push("Add at least 3 vocabulary items.");
  if (sentences.length < 1) errors.push("Add at least one model sentence so the games have something to say.");

  function handleLevelChange(next: ActflLevelId) {
    setLevel(next);
    const untouched = canDo.join("|") === suggestCanDo(level).join("|");
    if (untouched) setCanDo(suggestCanDo(next));
  }

  function updateCanDo(i: number, value: string) {
    setCanDo((prev) => prev.map((s, idx) => (idx === i ? value : s)));
  }

  function submit() {
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }
    setSaving(true);
    const now = Date.now();
    const lesson: Lesson = {
      id: initial?.id ?? newId(),
      title: title.trim(),
      languageId,
      level,
      theme: theme.trim() || title.trim(),
      essentialQuestion: essentialQuestion.trim(),
      canDo: canDo.map((s) => s.trim()).filter(Boolean),
      vocabulary: vocab,
      sentences,
      structures: linesToArray(structuresText),
      cultureNote: cultureNote.trim(),
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    };
    saveLesson(lesson);
    toast.success(initial ? "Lesson updated" : `Generated ${LEVEL_COUNTS[level]} materials`);
    router.push(`/teacher/${lesson.id}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Lesson basics</CardTitle>
            <CardDescription>Title, language, and the ACTFL proficiency level you are targeting.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="title">Lesson title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. La comida: What do you like to eat?" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="language">Target language</Label>
              <NativeSelect id="language" value={languageId} onChange={(e) => setLanguageId(e.target.value)} className="w-full">
                {LANGUAGES.map((l) => (
                  <NativeSelectOption key={l.id} value={l.id}>
                    {l.flag} {l.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="level">ACTFL proficiency target</Label>
              <NativeSelect id="level" value={level} onChange={(e) => handleLevelChange(e.target.value as ActflLevelId)} className="w-full">
                {ACTFL_LEVELS.map((l) => (
                  <NativeSelectOption key={l.id} value={l.id}>
                    {l.label} ({LEVEL_COUNTS[l.id]} materials)
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="theme">Theme / unit</Label>
              <Input id="theme" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g. Food & meals" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="eq">Essential question</Label>
              <Input id="eq" value={essentialQuestion} onChange={(e) => setEssentialQuestion(e.target.value)} placeholder="¿Qué te gusta comer y por qué?" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Language content</CardTitle>
            <CardDescription>Everything below is poured into the generated activities and the student games.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="vocab">Vocabulary</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{vocab.length} items</Badge>
                  {!vocabText && (
                    <Button type="button" variant="ghost" size="xs" onClick={() => setVocabText(STARTER_VOCAB)}>
                      <Wand2 /> Insert example
                    </Button>
                  )}
                </div>
              </div>
              <Textarea
                id="vocab"
                rows={8}
                value={vocabText}
                onChange={(e) => setVocabText(e.target.value)}
                placeholder={"One per line: word = meaning\n" + STARTER_VOCAB}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Separate the word and its meaning with =, :, a tab, or a dash.</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="sentences">Model sentences</Label>
                <Badge variant="secondary">{sentences.length} sentences</Badge>
              </div>
              <Textarea
                id="sentences"
                rows={5}
                value={sentencesText}
                onChange={(e) => setSentencesText(e.target.value)}
                placeholder={"One per line, in the target language:\nMe gusta el pollo con arroz.\n¿Qué te gusta comer?"}
              />
              <p className="text-xs text-muted-foreground">Used for Speak Quest, Sentence Scramble, dictations, and sequencing tasks. More sentences = longer games.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="structures">Structures / functional chunks</Label>
                <Textarea id="structures" rows={3} value={structuresText} onChange={(e) => setStructuresText(e.target.value)} placeholder={"me gusta + noun\n¿Qué te gusta…?"} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="culture">Culture note (optional)</Label>
                <Textarea id="culture" rows={3} value={cultureNote} onChange={(e) => setCultureNote(e.target.value)} placeholder="A product, practice, or perspective to compare." />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Can-Do goals</CardTitle>
            <CardDescription>
              Pre-filled from the NCSSFL-ACTFL benchmarks for {levelInfo.label}. Edit them to match your lesson; students will self-assess against these.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {canDo.map((s, i) => (
              <div key={i} className="flex gap-2">
                <Textarea rows={2} value={s} onChange={(e) => updateCanDo(i, e.target.value)} className="text-sm" />
                <Button type="button" variant="ghost" size="icon" onClick={() => setCanDo((prev) => prev.filter((_, idx) => idx !== i))} aria-label="Remove Can-Do">
                  <X />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCanDo((prev) => [...prev, "I can "])}>
                <Plus /> Add statement
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setCanDo(suggestCanDo(level))}>
                <RotateCcw /> Reset to {levelInfo.short} benchmarks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <Card className="border-primary/30 bg-gradient-to-b from-accent/60 to-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="size-4 text-primary" /> {levelInfo.label}
            </CardTitle>
            <CardDescription>{levelInfo.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <span className="font-medium">Text type:</span> <span className="text-muted-foreground">{levelInfo.textType}</span>
            </p>
            <p>
              <span className="font-medium">Materials ready:</span>{" "}
              <span className="text-muted-foreground">{LEVEL_COUNTS[level]} activities tuned to this level</span>
            </p>
            {errors.length > 0 && (
              <ul className="space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
                {errors.map((e) => (
                  <li key={e}>• {e}</li>
                ))}
              </ul>
            )}
            <Button className="h-10 w-full" onClick={submit} disabled={saving}>
              <Save /> {initial ? "Save changes" : "Generate materials"}
            </Button>
          </CardContent>
        </Card>
        {vocab.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Vocabulary preview</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="max-h-64 space-y-1 overflow-auto text-sm">
                {vocab.map((v, i) => (
                  <li key={i} className="flex justify-between gap-3 border-b border-border/50 py-1 last:border-0">
                    <span className="font-medium">{v.term}</span>
                    <span className="text-right text-muted-foreground">{v.translation || "—"}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </aside>
    </div>
  );
}

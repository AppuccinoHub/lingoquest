"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressPanel } from "@/components/arcade/progress-panel";
import { announce } from "@/components/arcade/rewards";
import { GAMES } from "@/components/arcade/games";
import { getLanguage, getLevel } from "@/lib/actfl";
import { toggleCanDo } from "@/lib/gamification";
import { findLesson, useProgress, useStored } from "@/lib/storage";
import type { Lesson, StudentProgress } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function LessonArcadePage() {
  const params = useParams<{ id: string }>();
  const [lesson] = useStored(() => findLesson(params.id) ?? null, params.id);
  const [progress, refresh] = useProgress();

  if (lesson === undefined || progress === undefined) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {GAMES.map((g) => (
            <div key={g.id} className="h-56 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (lesson === null) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Lesson not found on this device</h1>
        <p className="text-muted-foreground">Ask your teacher for the student link; opening it saves the lesson here.</p>
        <Button render={<Link href="/play" />}>Back to the arcade</Button>
      </div>
    );
  }

  return <Hub lesson={lesson} progress={progress} refresh={refresh} />;
}

function Hub({ lesson, progress, refresh }: { lesson: Lesson; progress: StudentProgress; refresh: () => void }) {
  const level = getLevel(lesson.level);
  const lang = getLanguage(lesson.languageId);
  const results = progress.games[lesson.id] ?? {};
  const checked = progress.canDoChecked[lesson.id] ?? [];

  function toggle(i: number) {
    const result = toggleCanDo(lesson.id, i);
    announce(result);
    refresh();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <Link href="/play" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All lessons
      </Link>
      <header className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {lang.flag} {lang.name}
            </Badge>
            <Badge variant="outline">{level.label}</Badge>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{lesson.title}</h1>
          {lesson.essentialQuestion && <p className="text-muted-foreground">{lesson.essentialQuestion}</p>}
        </div>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {GAMES.map((g) => {
          const r = results[g.id];
          const Icon = g.icon;
          return (
            <Link key={g.id} href={`/play/${lesson.id}/${g.id}`} className="group">
              <Card className="h-full p-5 transition-colors group-hover:border-primary/35">
                <CardContent className="space-y-3 p-0">
                  <div className="flex items-start justify-between gap-3">
                    <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", g.color)}>
                      <Icon className="size-5" />
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">{g.xp}</span>
                  </div>
                  <h2 className="text-lg font-semibold">{g.name}</h2>
                  <p className="text-sm text-muted-foreground">{g.tagline}</p>
                  <p className="pt-1 text-xs font-medium">
                    {r ? (
                      <span className="text-primary">
                        {g.scoreLabel(r.bestScore)} · {r.plays} {r.plays === 1 ? "play" : "plays"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Not played yet</span>
                    )}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold">Can-Do self-check</h2>
            <p className="text-sm text-muted-foreground">Honest self-assessment is part of the ACTFL Can-Do framework. Check a statement when you can really do it.</p>
            <ul className="mt-4 space-y-3">
              {lesson.canDo.map((s, i) => {
                const on = checked.includes(i);
                return (
                  <li key={i}>
                    <label className={cn("flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors", on ? "border-primary/25 bg-accent" : "border-border hover:bg-muted/50")}>
                      <Checkbox checked={on} onCheckedChange={() => toggle(i)} className="mt-0.5" />
                      <span className="text-sm">{s}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 rounded-xl bg-muted p-4 text-sm">
              <p className="font-medium">Words in this lesson</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {lesson.vocabulary.map((v, i) => (
                  <span key={i} className="rounded-md bg-background px-2 py-1 text-xs shadow-sm">
                    <span className="font-medium">{v.term}</span>
                    {v.translation && <span className="text-muted-foreground"> · {v.translation}</span>}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <ProgressPanel progress={progress} compact />
      </section>
    </div>
  );
}

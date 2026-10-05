"use client";

import Link from "next/link";
import { ArrowRight, Gamepad2, Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressPanel } from "@/components/arcade/progress-panel";
import { getLanguage, getLevel } from "@/lib/actfl";
import { allLessonsWithDemo, useProgress, useStored } from "@/lib/storage";

export default function ArcadeHome() {
  const [lessons] = useStored(allLessonsWithDemo);
  const [progress] = useProgress();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <Badge variant="secondary" className="gap-1 rounded-full">
            <Mic className="size-3" /> Just you and your device. Nobody else hears you.
          </Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Student arcade</h1>
          <p className="mt-1 text-muted-foreground">Pick a lesson to play. Every attempt earns XP, even the messy ones.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {lessons === undefined && Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />)}
            {lessons?.map((lesson) => {
              const level = getLevel(lesson.level);
              const lang = getLanguage(lesson.languageId);
              const games = progress?.games[lesson.id];
              const played = games ? Object.keys(games).length : 0;
              return (
                <Card key={lesson.id} className="group relative flex flex-col transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {lang.flag} {lang.name}
                      </Badge>
                      <Badge variant="outline">{level.label}</Badge>
                    </div>
                    <CardTitle className="mt-2 text-lg leading-snug">
                      <Link href={`/play/${lesson.id}`} className="after:absolute after:inset-0">
                        {lesson.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {lesson.vocabulary.length} words · {lesson.sentences.length} sentences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{played ? `${played}/3 games played` : "Not played yet"}</span>
                    <span className="flex items-center gap-1 font-medium text-primary">
                      Play <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Got a link from your teacher?</p>
            <p>Open it on this device and the lesson will appear here. Teachers create lessons in the{" "}
              <Link href="/teacher" className="underline underline-offset-2">Teacher studio</Link>.
            </p>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {progress ? <ProgressPanel progress={progress} /> : <div className="h-80 animate-pulse rounded-2xl bg-muted" />}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Gamepad2 className="size-4 text-primary" /> How XP works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Speak Quest: 10 XP per attempt, up to 30 XP for a 3-star match.</p>
              <p>Vocab Blitz: 5 XP per correct answer, multiplied by your combo.</p>
              <p>Sentence Scramble: 15 XP per sentence, plus 10 for reading it aloud.</p>
              <p>Ranks follow the ACTFL sublevels: Word Collector → Phrase Finder → Sentence Starter → Conversation Rookie…</p>
              <Button render={<Link href="/play/demo-la-comida" />} variant="outline" size="sm" className="mt-2">Try the demo lesson</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

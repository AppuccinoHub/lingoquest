"use client";

import Link from "next/link";
import { BookOpen, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLanguage, getLevel } from "@/lib/actfl";
import { DEMO_LESSON } from "@/lib/demo-lesson";
import { LEVEL_COUNTS } from "@/lib/generator";
import { deleteLesson, useLessons } from "@/lib/storage";
import type { Lesson } from "@/lib/types";

export default function TeacherHome() {
  const [lessons, refresh] = useLessons();

  function remove(lesson: Lesson) {
    if (!window.confirm(`Delete "${lesson.title}"? Students who already opened it keep their copy.`)) return;
    deleteLesson(lesson.id);
    refresh();
    toast.success("Lesson deleted");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher studio</h1>
          <p className="mt-1 text-muted-foreground">Your lessons and the materials generated from them. Saved on this device.</p>
        </div>
        <Button render={<Link href="/teacher/new" />} className="h-10"><Plus /> New lesson</Button>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons === undefined &&
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-44 animate-pulse rounded-xl bg-muted" />)}

        {lessons?.filter((l) => l.id !== "demo-la-comida" && l.id !== DEMO_LESSON.id).map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} onDelete={() => remove(lesson)} />
        ))}

        {lessons !== undefined && (
          <LessonCard lesson={DEMO_LESSON} demo />
        )}

        {lessons !== undefined && lessons.length === 0 && (
          <Card className="flex flex-col justify-center border-dashed sm:col-span-2 lg:col-span-1">
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Sparkles className="size-5" />
              </span>
              <p className="font-medium">No lessons yet</p>
              <p className="text-sm text-muted-foreground">Paste a vocabulary list and a few model sentences. Generation takes a second.</p>
              <Button render={<Link href="/teacher/new" />} variant="outline">Create your first lesson</Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

function LessonCard({ lesson, demo, onDelete }: { lesson: Lesson; demo?: boolean; onDelete?: () => void }) {
  const level = getLevel(lesson.level);
  const lang = getLanguage(lesson.languageId);
  return (
    <Card className="group relative flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {lang.flag} {lang.name}
          </Badge>
          <Badge variant="outline">{level.label}</Badge>
          {demo && <Badge className="bg-accent text-accent-foreground hover:bg-accent">Demo</Badge>}
        </div>
        <CardTitle className="mt-2 line-clamp-2 text-lg leading-snug">
          <Link href={`/teacher/${lesson.id}`} className="after:absolute after:inset-0">
            {lesson.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2">{lesson.essentialQuestion || lesson.theme}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <BookOpen className="size-4" /> {lesson.vocabulary.length} words · {LEVEL_COUNTS[lesson.level]} materials
        </span>
        {onDelete && (
          <Button variant="ghost" size="icon-sm" className="relative z-10 text-muted-foreground hover:text-destructive" onClick={onDelete} aria-label="Delete lesson">
            <Trash2 />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

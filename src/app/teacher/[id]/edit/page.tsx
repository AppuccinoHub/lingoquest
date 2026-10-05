"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LessonForm } from "@/components/lesson-form";
import { findLesson, useStored } from "@/lib/storage";

export default function EditLessonPage() {
  const params = useParams<{ id: string }>();
  const [lesson] = useStored(() => findLesson(params.id) ?? null, params.id);

  if (lesson === undefined) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="h-96 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (lesson === null || lesson.createdAt === 0) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">{lesson === null ? "Lesson not found" : "The demo lesson is read-only"}</h1>
        <p className="text-muted-foreground">
          {lesson === null ? "This lesson is not stored on this device." : "Create a new lesson to customise vocabulary and sentences."}
        </p>
        <Button render={<Link href="/teacher/new" />}>Create a lesson</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Link href={`/teacher/${lesson.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to materials
      </Link>
      <div className="mb-6 mt-3">
        <h1 className="text-3xl font-bold tracking-tight">Edit lesson</h1>
        <p className="mt-1 text-muted-foreground">Materials regenerate instantly when you save.</p>
      </div>
      <LessonForm initial={lesson} />
    </div>
  );
}

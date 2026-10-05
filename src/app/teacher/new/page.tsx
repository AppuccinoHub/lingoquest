import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LessonForm } from "@/components/lesson-form";

export const metadata = { title: "New lesson" };

export default function NewLessonPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Link href="/teacher" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All lessons
      </Link>
      <div className="mb-6 mt-3">
        <h1 className="text-3xl font-bold tracking-tight">New lesson</h1>
        <p className="mt-1 text-muted-foreground">
          Enter what you are already teaching. LingoQuest matches it to the ACTFL level and builds the supplemental materials.
        </p>
      </div>
      <LessonForm />
    </div>
  );
}

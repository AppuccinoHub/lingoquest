"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { playLessonPath } from "@/lib/paths";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GAMES } from "@/components/arcade/games";
import { findLesson, useStored } from "@/lib/storage";
import type { Lesson } from "@/lib/types";

interface Props {
  gameId: (typeof GAMES)[number]["id"];
  children: (lesson: Lesson) => React.ReactNode;
}

export function GameShell({ gameId, children }: Props) {
  const id = useSearchParams().get("id") ?? "";
  const [lesson] = useStored(() => findLesson(id) ?? null, id);
  const game = GAMES.find((g) => g.id === gameId)!;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
      <div className="flex items-center justify-between">
        <Link href={lesson ? playLessonPath(lesson.id) : "/play"} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {lesson ? lesson.title : "Arcade"}
        </Link>
        <span className="text-sm font-semibold">{game.name}</span>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        {lesson === undefined && <div className="h-96 animate-pulse rounded-2xl bg-muted" />}
        {lesson === null && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <h1 className="text-xl font-bold">Lesson not found on this device</h1>
            <Button render={<Link href="/play" />}>Back to the arcade</Button>
          </div>
        )}
        {lesson && children(lesson)}
      </div>
    </div>
  );
}

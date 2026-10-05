"use client";

import { GameShell } from "@/components/arcade/game-shell";
import { VocabBlitz } from "@/components/arcade/vocab-blitz";

export default function BlitzPage() {
  return <GameShell gameId="blitz">{(lesson) => <VocabBlitz key={lesson.id} lesson={lesson} />}</GameShell>;
}

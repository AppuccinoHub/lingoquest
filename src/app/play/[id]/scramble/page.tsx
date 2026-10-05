"use client";

import { GameShell } from "@/components/arcade/game-shell";
import { SentenceScramble } from "@/components/arcade/sentence-scramble";

export default function ScramblePage() {
  return <GameShell gameId="scramble">{(lesson) => <SentenceScramble key={lesson.id} lesson={lesson} />}</GameShell>;
}

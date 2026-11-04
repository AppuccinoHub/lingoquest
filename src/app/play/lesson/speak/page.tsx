"use client";

import { GameShell } from "@/components/arcade/game-shell";
import { SpeakQuest } from "@/components/arcade/speak-quest";

export default function SpeakPage() {
  return <GameShell gameId="speak">{(lesson) => <SpeakQuest key={lesson.id} lesson={lesson} />}</GameShell>;
}

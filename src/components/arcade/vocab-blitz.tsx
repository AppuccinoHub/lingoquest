"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, RotateCcw, Timer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { announce } from "@/components/arcade/rewards";
import { getLanguage } from "@/lib/actfl";
import { award } from "@/lib/gamification";
import { speak } from "@/lib/speech";
import type { Lesson, VocabItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROUND_SECONDS = 60;
const MAX_MULTIPLIER = 5;

interface Question {
  prompt: string;
  answer: string;
  options: string[];
  direction: "toTarget" | "toEnglish";
  item: VocabItem;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeQuestion(pool: VocabItem[], avoid?: string): Question {
  const candidates = pool.filter((v) => v.term !== avoid);
  const item = candidates[Math.floor(Math.random() * candidates.length)] ?? pool[0];
  const direction: Question["direction"] = Math.random() < 0.6 ? "toTarget" : "toEnglish";
  const distractors = shuffle(pool.filter((v) => v.term !== item.term)).slice(0, 3);
  const pick = (v: VocabItem) => (direction === "toTarget" ? v.term : v.translation);
  return {
    prompt: direction === "toTarget" ? item.translation : item.term,
    answer: pick(item),
    options: shuffle([pick(item), ...distractors.map(pick)]),
    direction,
    item,
  };
}

type Phase = "intro" | "playing" | "done";

export function VocabBlitz({ lesson }: { lesson: Lesson }) {
  const language = getLanguage(lesson.languageId);
  const pool = useMemo(() => lesson.vocabulary.filter((v) => v.term.trim() && v.translation.trim()), [lesson]);
  const [rawPhase, setPhase] = useState<Phase>("intro");
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [question, setQuestion] = useState<Question | null>(null);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [flash, setFlash] = useState<{ choice: string; ok: boolean } | null>(null);
  const lockRef = useRef(false);

  const multiplier = Math.min(MAX_MULTIPLIER, Math.max(1, combo));
  const phase: Phase = rawPhase === "playing" && timeLeft <= 0 ? "done" : rawPhase;

  useEffect(() => {
    if (phase !== "playing") return;
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  // Stats are frozen once the clock hits zero, so awarding in an effect keyed on them is safe;
  // the guard ref keeps Strict Mode's double-invocation from granting XP twice.
  const awardedRef = useRef(false);
  useEffect(() => {
    if (phase !== "done" || awardedRef.current) return;
    awardedRef.current = true;
    announce(award({ xp, lessonId: lesson.id, game: "blitz", score, combo: bestCombo }));
  }, [phase, xp, score, bestCombo, lesson.id]);

  function start() {
    awardedRef.current = false;
    setPhase("playing");
    setTimeLeft(ROUND_SECONDS);
    setCombo(0);
    setBestCombo(0);
    setScore(0);
    setXp(0);
    setCorrect(0);
    setAnswered(0);
    setFlash(null);
    setQuestion(makeQuestion(pool));
  }

  function choose(option: string) {
    if (!question || lockRef.current) return;
    lockRef.current = true;
    const ok = option === question.answer;
    setFlash({ choice: option, ok });
    setAnswered((n) => n + 1);
    if (ok) {
      const nextCombo = combo + 1;
      const mult = Math.min(MAX_MULTIPLIER, Math.max(1, nextCombo));
      setCombo(nextCombo);
      setBestCombo((b) => Math.max(b, nextCombo));
      setScore((s) => s + 100 * mult);
      setXp((x) => x + 5 * mult);
      setCorrect((c) => c + 1);
    } else {
      setCombo(0);
    }
    setTimeout(() => {
      setFlash(null);
      setQuestion(makeQuestion(pool, question.item.term));
      lockRef.current = false;
    }, ok ? 350 : 700);
  }

  if (pool.length < 4) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Vocab Blitz needs at least 4 vocabulary items with meanings. This lesson has {pool.length}.
        </CardContent>
      </Card>
    );
  }

  if (phase === "intro") {
    return (
      <Card className="flex-1">
        <CardContent className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
          <span className="grid size-20 place-items-center rounded-3xl bg-secondary text-foreground">
            <Zap className="size-10" />
          </span>
          <div>
            <h2 className="text-3xl font-bold">Vocab Blitz</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              {ROUND_SECONDS} seconds. See a meaning, tap the {language.name} word (or the reverse). Each correct answer in a row raises your multiplier up to {MAX_MULTIPLIER}×.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <Stat label="Words" value={pool.length} />
            <Stat label="XP / answer" value={`5–${5 * MAX_MULTIPLIER}`} />
            <Stat label="Badge" value="5× combo" />
          </div>
          <Button onClick={start} className="h-12 px-8 text-base">
            Start the clock
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (phase === "done") {
    const accuracy = answered ? Math.round((correct / answered) * 100) : 0;
    return (
      <Card className="flex-1 animate-pop-in">
        <CardContent className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Time!</p>
          <h2 className="text-5xl font-bold tabular-nums">{score.toLocaleString()}</h2>
          <p className="text-muted-foreground">points</p>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <Stat label="Correct" value={`${correct}/${answered}`} />
            <Stat label="Accuracy" value={`${accuracy}%`} />
            <Stat label="Best combo" value={`${bestCombo}×`} />
          </div>
          <p className="text-2xl font-bold text-primary">+{xp} XP</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={start} className="h-10">
              <RotateCcw /> Play again
            </Button>
            <Button render={<Link href={`/play/${lesson.id}`} />} variant="outline" className="h-10">Back to lesson <ArrowRight /></Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid grid-cols-3 items-center">
        <span className={cn("flex items-center gap-1.5 text-lg font-bold tabular-nums", timeLeft <= 10 && "text-foreground")}>
          <Timer className="size-5" /> {timeLeft}s
        </span>
        <span className={cn("justify-self-center rounded-full px-3 py-1 text-sm font-bold", combo >= 3 ? "bg-secondary text-foreground" : "bg-muted text-muted-foreground")}>
          <Flame className="mr-1 inline size-4" /> {combo}× combo
        </span>
        <span className="justify-self-end text-lg font-bold tabular-nums">{score.toLocaleString()}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-foreground/70 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }} />
      </div>

      {question && (
        <Card>
          <CardContent className="flex flex-col gap-6 p-6 sm:p-8">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {question.direction === "toTarget" ? `Which is the ${language.name} word for…` : "What does this mean?"}
              </p>
              <button
                type="button"
                onClick={() => question.direction === "toEnglish" && speak(question.prompt, language.speechCode)}
                dir={question.direction === "toEnglish" && language.rtl ? "rtl" : "ltr"}
                className="mt-2 text-3xl font-bold leading-tight sm:text-4xl"
              >
                {question.prompt}
              </button>
              <p className="mt-1 text-xs text-muted-foreground">×{multiplier} multiplier active</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {question.options.map((opt, i) => {
                const isChoice = flash?.choice === opt;
                const isAnswer = flash && opt === question.answer;
                return (
                  <button
                    key={`${i}-${opt}`}
                    type="button"
                    onClick={() => choose(opt)}
                    dir={question.direction === "toTarget" && language.rtl ? "rtl" : "ltr"}
                    className={cn(
                      "min-h-16 rounded-2xl border-2 px-4 py-3 text-lg font-semibold shadow-sm transition-all active:scale-[0.98]",
                      !flash && "border-border bg-card hover:border-primary hover:bg-accent",
                      flash && isAnswer && "border-foreground/30 bg-secondary text-foreground",
                      flash && isChoice && !flash.ok && "border-foreground/20 bg-muted text-muted-foreground animate-shake",
                      flash && !isChoice && !isAnswer && "border-border opacity-40",
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-muted px-4 py-3">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Mic, RotateCcw, Shuffle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { announce } from "@/components/arcade/rewards";
import { getLanguage, type Language } from "@/lib/actfl";
import { award } from "@/lib/gamification";
import { recognizeOnce, similarity, speak, useSpeechSupported } from "@/lib/speech";
import type { Lesson } from "@/lib/types";
import { cn } from "@/lib/utils";

const HEARTS = 3;
const SENTENCE_XP = 15;
const SPEAK_BONUS_XP = 10;

interface Chunk {
  id: number;
  text: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function chunkSentence(sentence: string, noSpaces: boolean): Chunk[] {
  const parts = noSpaces ? Array.from(sentence.replace(/\s+/g, "")) : sentence.trim().split(/\s+/);
  return parts.map((text, id) => ({ id, text }));
}

function scramble(chunks: Chunk[]): Chunk[] {
  if (chunks.length < 2) return chunks;
  let out = shuffle(chunks);
  let guard = 0;
  while (out.every((c, i) => c.id === i) && guard++ < 10) out = shuffle(chunks);
  return out;
}

export function SentenceScramble({ lesson }: { lesson: Lesson }) {
  const language = getLanguage(lesson.languageId);
  const [seed, setSeed] = useState(0);
  const sentences = useMemo(
    () => shuffle(lesson.sentences.filter((s) => s.trim())).slice(0, 6),
    [lesson, seed], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [hearts, setHearts] = useState(HEARTS);
  const done = idx >= sentences.length;

  function handleScored(points: number, gained: number, solved: boolean) {
    setScore((s) => s + points);
    setXp((x) => x + gained);
    if (solved) setSolvedCount((n) => n + 1);
  }

  function next() {
    if (idx + 1 >= sentences.length) {
      const result = award({ xp: 0, lessonId: lesson.id, game: "scramble", score });
      announce(result);
    }
    setHearts(HEARTS);
    setIdx(idx + 1);
  }

  function restart() {
    setSeed((s) => s + 1);
    setIdx(0);
    setScore(0);
    setXp(0);
    setSolvedCount(0);
    setHearts(HEARTS);
  }

  if (sentences.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">This lesson has no model sentences yet. Ask your teacher to add a few.</CardContent>
      </Card>
    );
  }

  if (done) {
    return (
      <Card className="flex-1 animate-pop-in">
        <CardContent className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
          <span className="grid size-20 place-items-center rounded-3xl bg-gradient-to-br from-sky-400 to-emerald-500 text-white shadow-lg">
            <Shuffle className="size-10" />
          </span>
          <h2 className="text-4xl font-bold tabular-nums">{score.toLocaleString()} pts</h2>
          <p className="text-muted-foreground">
            {solvedCount} of {sentences.length} sentences rebuilt without losing all your hearts.
          </p>
          <p className="text-2xl font-bold text-primary">+{xp} XP</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={restart} className="h-10">
              <RotateCcw /> Shuffle again
            </Button>
            <Button render={<Link href={`/play/${lesson.id}`} />} variant="outline" className="h-10">
              Back to lesson <ArrowRight />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Sentence {idx + 1} / {sentences.length}
        </span>
        <span className="flex items-center gap-1">
          {Array.from({ length: HEARTS }).map((_, i) => (
            <Heart key={i} className={cn("size-5 transition-colors", i < hearts ? "fill-rose-500 text-rose-500" : "text-muted-foreground/30")} />
          ))}
        </span>
        <span className="font-bold tabular-nums">{score.toLocaleString()}</span>
      </div>
      <Progress value={(idx / sentences.length) * 100} className="h-2" />
      <SentenceRound
        key={`${seed}-${idx}`}
        sentence={sentences[idx]}
        language={language}
        isLast={idx + 1 >= sentences.length}
        onHearts={setHearts}
        onScored={handleScored}
        onNext={next}
      />
    </div>
  );
}

type Step = "build" | "solved" | "speaking";

interface RoundProps {
  sentence: string;
  language: Language;
  isLast: boolean;
  onHearts: (n: number) => void;
  onScored: (points: number, xp: number, solved: boolean) => void;
  onNext: () => void;
}

function SentenceRound({ sentence, language, isLast, onHearts, onScored, onNext }: RoundProps) {
  const supported = useSpeechSupported();
  const chunks = useMemo(() => chunkSentence(sentence, !!language.noSpaces), [sentence, language.noSpaces]);
  const [pool, setPool] = useState<Chunk[]>(() => scramble(chunks));
  const [placed, setPlaced] = useState<Chunk[]>([]);
  const [hearts, setHearts] = useState(HEARTS);
  const [wrongId, setWrongId] = useState<number | null>(null);
  const [step, setStep] = useState<Step>("build");
  const [transcript, setTranscript] = useState("");
  const [speakMsg, setSpeakMsg] = useState<string | null>(null);
  const [bonusEarned, setBonusEarned] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => () => stopRef.current?.(), []);

  useEffect(() => {
    if (step !== "speaking" || supported || countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, supported, countdown]);

  function solve(heartsLeft: number) {
    const points = heartsLeft > 0 ? 100 + 50 * heartsLeft : 0;
    const gained = heartsLeft > 0 ? SENTENCE_XP : 5;
    onScored(points, gained, heartsLeft > 0);
    announce(award({ xp: gained }));
    setStep("solved");
    speak(sentence, language.speechCode);
  }

  function tap(chunk: Chunk) {
    if (step !== "build") return;
    const expected = chunks[placed.length];
    if (chunk.text === expected.text) {
      const nextPlaced = [...placed, chunk];
      setPlaced(nextPlaced);
      setPool((p) => p.filter((c) => c.id !== chunk.id));
      if (nextPlaced.length === chunks.length) solve(hearts);
      return;
    }
    setWrongId(chunk.id);
    setTimeout(() => setWrongId(null), 400);
    const nextHearts = hearts - 1;
    setHearts(nextHearts);
    onHearts(nextHearts);
    if (nextHearts <= 0) {
      setPlaced(chunks);
      setPool([]);
      solve(0);
    }
  }

  function grantBonus(msg: string) {
    onScored(50, SPEAK_BONUS_XP, false);
    announce(award({ xp: SPEAK_BONUS_XP, speakAttempts: 1 }));
    setBonusEarned(true);
    setSpeakMsg(`${msg} +${SPEAK_BONUS_XP} XP`);
    setStep("solved");
  }

  async function readAloud() {
    setStep("speaking");
    setTranscript("");
    setSpeakMsg(null);
    if (!supported) {
      setCountdown(5);
      return;
    }
    const { promise, stop } = recognizeOnce(language.speechCode, setTranscript);
    stopRef.current = stop;
    try {
      const text = await promise;
      const sim = similarity(text, sentence, language.noSpaces);
      if (sim >= 0.5) {
        grantBonus(`Nice. ${Math.round(sim * 100)}% match.`);
      } else {
        setSpeakMsg(text ? `Heard “${text}”. ${Math.round(sim * 100)}% match. Try once more or move on.` : "Didn't catch that. Try again or move on.");
        setStep("solved");
      }
    } catch (e) {
      const code = (e as Error).message;
      setSpeakMsg(code === "not-allowed" ? "Mic blocked. You can still move on." : "Speech recognition unavailable right now. Moving on is fine.");
      setStep("solved");
    } finally {
      stopRef.current = null;
    }
  }

  return (
    <Card className="flex-1">
      <CardContent className="flex h-full flex-col gap-6 p-6 sm:p-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tap the pieces in order</p>
        </div>

        <div
          dir={language.rtl ? "rtl" : "ltr"}
          className={cn(
            "flex min-h-20 flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 transition-colors",
            step === "build" ? "border-border bg-muted/40" : "border-emerald-400 bg-emerald-50 dark:bg-emerald-950",
          )}
        >
          {placed.length === 0 && <span className="text-sm text-muted-foreground">Your sentence appears here</span>}
          {placed.map((c) => (
            <span key={c.id} className="animate-pop-in rounded-xl bg-primary px-3 py-2 text-lg font-semibold text-primary-foreground shadow-sm">
              {c.text}
            </span>
          ))}
        </div>

        {step === "build" && (
          <div dir={language.rtl ? "rtl" : "ltr"} className="flex flex-wrap items-center justify-center gap-2">
            {pool.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => tap(c)}
                className={cn(
                  "rounded-xl border-2 border-border bg-card px-3 py-2 text-lg font-semibold shadow-sm transition-all hover:border-primary hover:bg-accent active:scale-95",
                  wrongId === c.id && "animate-shake border-rose-500 bg-rose-50 dark:bg-rose-950",
                )}
              >
                {c.text}
              </button>
            ))}
          </div>
        )}

        {step !== "build" && (
          <div className="animate-pop-in space-y-4 rounded-2xl bg-muted/70 p-5 text-center">
            <p className="text-lg font-semibold">{hearts > 0 ? "Sentence rebuilt." : "Here is the full sentence."}</p>
            <p className="text-sm text-muted-foreground">Bonus round: read it aloud for +{SPEAK_BONUS_XP} XP. Only your device is listening.</p>
            {step === "speaking" ? (
              supported ? (
                <div className="space-y-2">
                  <div className="mx-auto grid size-16 place-items-center rounded-full bg-rose-500 text-white animate-pulse-ring">
                    <Mic className="size-7" />
                  </div>
                  <p className="text-sm text-muted-foreground">Listening… {transcript && <span className="text-foreground">“{transcript}”</span>}</p>
                  <Button variant="ghost" size="sm" onClick={() => stopRef.current?.()}>
                    Done speaking
                  </Button>
                </div>
              ) : countdown > 0 ? (
                <p className="text-5xl font-bold tabular-nums text-primary">{countdown}</p>
              ) : (
                <Button onClick={() => grantBonus("Read aloud.")} className="h-11">
                  I read it aloud
                </Button>
              )
            ) : (
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="outline" onClick={() => speak(sentence, language.speechCode)}>
                  <Volume2 /> Hear it
                </Button>
                {!bonusEarned && (
                  <Button onClick={readAloud}>
                    <Mic /> Read it aloud
                  </Button>
                )}
                <Button variant={bonusEarned ? "default" : "ghost"} onClick={onNext}>
                  {isLast ? "Finish" : "Next sentence"} <ArrowRight />
                </Button>
              </div>
            )}
            {speakMsg && <p className="text-sm text-muted-foreground">{speakMsg}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Ear, EyeOff, Mic, MicOff, RotateCcw, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { announce, Stars } from "@/components/arcade/rewards";
import { getLanguage } from "@/lib/actfl";
import { award } from "@/lib/gamification";
import { getRecognitionCtor, similarity, speak, starsFor, useSpeechSupported, vocabHits, type SpeechRecognitionLike } from "@/lib/speech";
import type { Lesson } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Prompt {
  kind: "word" | "sentence" | "open";
  stage: string;
  instruction: string;
  target: string;
  hint?: string;
  mustUse?: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPrompts(lesson: Lesson): Prompt[] {
  const words = shuffle(lesson.vocabulary.filter((v) => v.term.trim())).slice(0, 4);
  const sentences = shuffle(lesson.sentences.filter(Boolean)).slice(0, 4);
  const questions = lesson.sentences.filter((s) => /[?？]/.test(s));
  const openTerms = shuffle(lesson.vocabulary).slice(0, 2);

  const prompts: Prompt[] = [
    ...words.map<Prompt>((w) => ({ kind: "word", stage: "Stage 1 · Words", instruction: "Say this word", target: w.term, hint: w.translation })),
    ...sentences.map<Prompt>((s) => ({ kind: "sentence", stage: "Stage 2 · Sentences", instruction: "Say this sentence", target: s })),
  ];
  if (questions.length) {
    prompts.push({
      kind: "open",
      stage: "Stage 3 · Your turn",
      instruction: "Answer this question with your own sentence",
      target: questions[0],
      mustUse: lesson.vocabulary.slice(0, 6).map((v) => v.term),
      hint: "Use any word from the lesson",
    });
  }
  openTerms.forEach((t) =>
    prompts.push({
      kind: "open",
      stage: "Stage 3 · Your turn",
      instruction: "Make your own sentence with",
      target: t.term,
      hint: t.translation,
      mustUse: [t.term],
    }),
  );
  return prompts;
}

type Phase = "ready" | "listening" | "result" | "fallback";

export function SpeakQuest({ lesson }: { lesson: Lesson }) {
  const language = getLanguage(lesson.languageId);
  const [seed, setSeed] = useState(0);
  const prompts = useMemo(() => buildPrompts(lesson), [lesson, seed]); // eslint-disable-line react-hooks/exhaustive-deps
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const [sessionXp, setSessionXp] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const supported = useSpeechSupported();
  const [countdown, setCountdown] = useState(0);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const phaseRef = useRef<Phase>("ready");
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const prompt = prompts[idx];
  const done = idx >= prompts.length;

  useEffect(() => () => recRef.current?.abort(), []);

  const finishPrompt = useCallback(
    (s: number) => {
      const stars = starsFor(s);
      const xp = 10 + (stars >= 2 ? 10 : 0) + (stars === 3 ? 10 : 0);
      const result = award({ xp, speakAttempts: 1 });
      announce(result);
      setSessionXp((v) => v + xp);
      setScore(s);
      setAttempts((a) => a + 1);
      setPhase("result");
    },
    [],
  );

  function scoreTranscript(text: string): number {
    if (prompt.kind === "open") {
      const hits = vocabHits(text, prompt.mustUse ?? [], language.noSpaces);
      const words = language.noSpaces ? Array.from(text.replace(/\s/g, "")).length / 2 : text.trim().split(/\s+/).filter(Boolean).length;
      const required = Math.min(prompt.mustUse?.length ?? 1, 1);
      return Math.min(1, (hits.length >= required ? 0.7 : 0.25) + Math.min(words / 6, 1) * 0.3);
    }
    return similarity(text, prompt.target, language.noSpaces);
  }

  function startListening() {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      beginFallback();
      return;
    }
    setErrorMsg(null);
    setTranscript("");
    const rec = new Ctor();
    recRef.current = rec;
    rec.lang = language.speechCode;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 3;
    let finalText = "";
    rec.onresult = (ev) => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      setTranscript(finalText || interim);
    };
    rec.onerror = (ev) => {
      recRef.current = null;
      if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
        setErrorMsg("Microphone access was blocked. Allow the mic in your browser, or use the self-check mode below.");
      } else if (ev.error === "no-speech") {
        setErrorMsg("Didn't catch anything. Tap the mic and speak a little louder.");
      } else if (ev.error === "network") {
        setErrorMsg("Speech recognition needs an internet connection in this browser. You can still practise in self-check mode.");
      } else if (ev.error !== "aborted") {
        setErrorMsg(`Speech recognition hiccup (${ev.error}). Try again or use self-check mode.`);
      }
      setPhase("ready");
    };
    rec.onend = () => {
      recRef.current = null;
      if (phaseRef.current !== "listening") return;
      if (finalText.trim()) finishPrompt(scoreTranscript(finalText));
      else setPhase("ready");
    };
    setPhase("listening");
    try {
      rec.start();
    } catch {
      setErrorMsg("Could not start the microphone. Try again.");
      setPhase("ready");
    }
  }

  function stopListening() {
    recRef.current?.stop();
  }

  function beginFallback() {
    setErrorMsg(null);
    setTranscript("");
    setPhase("fallback");
    setCountdown(prompt.kind === "word" ? 3 : 6);
  }

  useEffect(() => {
    if (phase !== "fallback" || countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  function selfRate(level: 1 | 2 | 3) {
    const s = level === 3 ? 0.9 : level === 2 ? 0.65 : 0.4;
    setTranscript("");
    finishPrompt(s);
  }

  function next() {
    const final = score ?? 0;
    const nextResults = [...results, final];
    setResults(nextResults);
    setScore(null);
    setAttempts(0);
    setTranscript("");
    setPhase("ready");
    if (idx + 1 >= prompts.length) {
      const avg = Math.round((nextResults.reduce((a, b) => a + b, 0) / nextResults.length) * 100);
      const result = award({ xp: 20, lessonId: lesson.id, game: "speak", score: avg });
      announce(result);
      setSessionXp((v) => v + 20);
    }
    setIdx(idx + 1);
  }

  function skip() {
    setScore(0);
    setResults((r) => [...r, 0]);
    setAttempts(0);
    setTranscript("");
    setPhase("ready");
    if (idx + 1 >= prompts.length) {
      const result = award({ xp: 0, lessonId: lesson.id, game: "speak", score: Math.round((results.reduce((a, b) => a + b, 0) / prompts.length) * 100) });
      announce(result);
    }
    setIdx(idx + 1);
  }

  function restart() {
    setSeed((s) => s + 1);
    setIdx(0);
    setResults([]);
    setScore(null);
    setAttempts(0);
    setSessionXp(0);
    setPhase("ready");
  }

  if (prompts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">This lesson has no vocabulary or sentences yet. Ask your teacher to add some.</CardContent>
      </Card>
    );
  }

  if (done) {
    const avg = results.reduce((a, b) => a + b, 0) / results.length;
    return (
      <Card className="animate-pop-in">
        <CardContent className="space-y-6 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quest complete</p>
          <h2 className="text-3xl font-bold">You spoke {results.length} times.</h2>
          <p className="text-muted-foreground">
            That is {results.length} more than staying quiet. Average match {Math.round(avg * 100)}%.
          </p>
          <div className="flex items-center justify-center gap-6">
            <div>
              <p className="text-3xl font-bold text-primary">+{sessionXp}</p>
              <p className="text-xs text-muted-foreground">XP earned</p>
            </div>
            <div>
              <Stars count={starsFor(avg)} size="text-3xl" />
              <p className="text-xs text-muted-foreground">overall</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {results.map((r, i) => (
              <span key={i} className={cn("size-3 rounded-full", r >= 0.85 ? "bg-emerald-500" : r >= 0.6 ? "bg-amber-400" : r > 0 ? "bg-orange-400" : "bg-muted-foreground/30")} />
            ))}
          </div>
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <Button onClick={restart} className="h-10">
              <RotateCcw /> Play again with new prompts
            </Button>
            <Button render={<Link href={`/play/${lesson.id}`} />} variant="outline" className="h-10">Back to lesson <ArrowRight /></Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stars = score !== null ? starsFor(score) : 0;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-semibold uppercase tracking-wide">{prompt.stage}</span>
        <span>
          {idx + 1} / {prompts.length} · +{sessionXp} XP this round
        </span>
      </div>
      <Progress value={((idx + (phase === "result" ? 1 : 0)) / prompts.length) * 100} className="h-2" />

      <Card className={cn("flex-1", phase === "result" && stars === 0 && "animate-shake")}>
        <CardContent className="flex h-full flex-col gap-6 p-6 sm:p-8">
          <div className="space-y-1 text-center">
            <p className="text-sm text-muted-foreground">{prompt.instruction}</p>
            <p dir={language.rtl ? "rtl" : "ltr"} className={cn("font-bold leading-tight", prompt.kind === "word" ? "text-4xl" : "text-2xl sm:text-3xl")}>
              {prompt.target}
            </p>
            {prompt.hint && <p className="text-sm text-muted-foreground">“{prompt.hint}”</p>}
            <Button variant="ghost" size="sm" className="mt-1" onClick={() => speak(prompt.target, language.speechCode)}>
              <Volume2 /> Hear it
            </Button>
          </div>

          {phase === "result" ? (
            <div className="animate-pop-in space-y-4 rounded-2xl bg-muted/70 p-5 text-center">
              <Stars count={stars} size="text-4xl" />
              <p className="text-lg font-semibold">
                {stars === 3 ? "Excellent. That sounded great." : stars === 2 ? "Good. Close match." : stars === 1 ? "You tried, and that counts." : "Not quite. Hear it and try once more."}
              </p>
              {transcript && (
                <p className="text-sm text-muted-foreground">
                  You said: <span className="font-medium text-foreground">“{transcript}”</span>
                </p>
              )}
              {score !== null && (
                <div className="mx-auto max-w-xs">
                  <div className="h-2 overflow-hidden rounded-full bg-background">
                    <div className={cn("h-full rounded-full transition-all", stars >= 2 ? "bg-emerald-500" : "bg-amber-400")} style={{ width: `${Math.round(score * 100)}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{Math.round(score * 100)}% match</p>
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-2">
                {attempts < 3 && stars < 3 && (
                  <Button variant="outline" onClick={() => { setPhase("ready"); setScore(null); }}>
                    <RotateCcw /> Try again
                  </Button>
                )}
                <Button onClick={next}>
                  {idx + 1 >= prompts.length ? "Finish" : "Next"} <ArrowRight />
                </Button>
              </div>
            </div>
          ) : phase === "fallback" ? (
            <div className="space-y-4 rounded-2xl bg-muted/70 p-5 text-center">
              {countdown > 0 ? (
                <>
                  <p className="text-6xl font-bold tabular-nums text-primary">{countdown}</p>
                  <p className="text-sm text-muted-foreground">Say it out loud now. Nobody is scoring you but you.</p>
                </>
              ) : (
                <>
                  <p className="font-semibold">How did it go?</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <Button variant="outline" className="h-12" onClick={() => selfRate(1)}>
                      I tried
                    </Button>
                    <Button variant="outline" className="h-12" onClick={() => selfRate(2)}>
                      Mostly right
                    </Button>
                    <Button className="h-12" onClick={() => selfRate(3)}>
                      <Check /> Nailed it
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => speak(prompt.target, language.speechCode)}>
                    <Volume2 /> Compare with the model
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <button
                type="button"
                onClick={phase === "listening" ? stopListening : startListening}
                className={cn(
                  "grid size-28 place-items-center rounded-full text-white shadow-xl transition-transform active:scale-95",
                  phase === "listening" ? "bg-rose-500 animate-pulse-ring" : "bg-primary hover:scale-105",
                )}
                aria-label={phase === "listening" ? "Stop listening" : "Start speaking"}
              >
                {phase === "listening" ? <MicOff className="size-12" /> : <Mic className="size-12" />}
              </button>
              <p className="text-sm font-medium">{phase === "listening" ? "Listening… tap to stop" : !supported ? "Tap to start self-check mode" : "Tap, then speak"}</p>
              <p className="min-h-6 text-center text-muted-foreground">{transcript && <span>“{transcript}”</span>}</p>
              {errorMsg && <p className="max-w-sm text-center text-sm text-amber-700 dark:text-amber-300">{errorMsg}</p>}
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                {supported && phase !== "listening" && (
                  <Button variant="ghost" size="sm" onClick={beginFallback}>
                    <Ear /> No mic? Use self-check
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={skip}>
                  <SkipForward /> Skip
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <EyeOff className="size-3.5" /> Audio is processed by your browser and never saved by this app.
      </p>
    </div>
  );
}

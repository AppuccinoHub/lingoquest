import Link from "next/link";
import { ArrowRight, Gamepad2, GraduationCap, Mic, ShieldCheck, Sparkles, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FIVE_CS, MODES } from "@/lib/actfl";
import { TOTAL_TEMPLATES } from "@/lib/generator";
import { DEMO_LESSON_ID } from "@/lib/demo-lesson";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20">
      <section className="grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
        <div className="space-y-6">
          <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
            <Sparkles className="size-3.5" /> Built on the ACTFL Proficiency Guidelines & Can-Do Statements
          </Badge>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            One lesson in. <span className="text-primary">Dozens of activities</span> out. Speaking practice kids actually want.
          </h1>
          <p className="max-w-prose text-lg text-muted-foreground">
            Paste your vocabulary and model sentences, pick an ACTFL level, and LingoQuest generates {TOTAL_TEMPLATES}{" "}
            level-appropriate warm-ups, interpretive tasks, partner activities, games, rubrics, and homework. Then students
            practise speaking privately with their device in an arcade that rewards every brave attempt.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button render={<Link href="/teacher/new" />} size="lg" className="h-11 px-5 text-base"><GraduationCap /> Build a lesson</Button>
            <Button render={<Link href={`/play/${DEMO_LESSON_ID}`} />} size="lg" variant="outline" className="h-11 px-5 text-base"><Gamepad2 /> Try the student arcade</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No accounts, no uploads. Everything is saved on this device; share lessons with students via a link.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 via-fuchsia-200/30 to-amber-100/40 blur-2xl dark:from-primary/20 dark:via-fuchsia-900/20 dark:to-amber-900/10" />
          <Card className="overflow-hidden border-border/70 shadow-xl">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Speak Quest · Stage 2</p>
                  <p className="text-lg font-semibold">Say it in Italian</p>
                </div>
                <Badge className="rounded-full bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-200">
                  +25 XP
                </Badge>
              </div>
              <div className="rounded-xl bg-muted p-4">
                <p className="text-sm text-muted-foreground">Your prompt</p>
                <p className="text-xl font-semibold">Mi piace la pizza con il pomodoro.</p>
                <p className="mt-1 text-sm text-muted-foreground">“I like pizza with tomato.”</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg animate-pulse-ring">
                  <Mic className="size-7" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">You said: “mi piace la pizza con il pomodoro”</p>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[96%] rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">96% match · ⭐⭐⭐ · Only you can hear this</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Feature
          icon={Timer}
          title="Minutes, not weekends"
          body="Enter one lesson once. Get warm-ups, info-gaps, role-plays, IPAs, exit tickets, and 5 Cs tasks, each pre-filled with your vocabulary and filtered to the proficiency level you teach."
        />
        <Feature
          icon={ShieldCheck}
          title="Private speaking practice"
          body="Students told us speaking in front of the class is embarrassing. In the arcade they talk to their own device; speech recognition scores them and nobody else hears a thing."
        />
        <Feature
          icon={Gamepad2}
          title="XP for every brave attempt"
          body="Ranks named after ACTFL sublevels, streaks, combo multipliers, and badges that reward attempts, not perfection. Students self-assess with the lesson's Can-Do statements."
        />
      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Three modes of communication</h2>
          <p className="mt-2 text-muted-foreground">Every generated activity is tagged with the ACTFL mode it targets so you can balance a unit at a glance.</p>
          <ul className="mt-4 space-y-3">
            {MODES.map((m) => (
              <li key={m.id} className="flex items-start gap-3 rounded-xl border border-border/70 bg-card p-4">
                <span className={`mt-0.5 rounded-md border px-2 py-0.5 text-xs font-semibold ${m.color}`}>{m.label}</span>
                <span className="text-sm text-muted-foreground">{m.blurb}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">The 5 Cs, built in</h2>
          <p className="mt-2 text-muted-foreground">Culture, Connections, Comparisons, and Communities tasks are generated alongside Communication, so your unit meets the World-Readiness Standards.</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {FIVE_CS.map((c) => (
              <li key={c.id} className="rounded-xl border border-border/70 bg-card p-4">
                <p className="font-semibold">{c.label}</p>
                <p className="text-sm text-muted-foreground">{c.blurb}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-16 flex flex-col items-center gap-4 rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground">
        <h2 className="text-3xl font-bold tracking-tight">Start with the demo lesson</h2>
        <p className="max-w-xl text-primary-foreground/80">
          A Novice Mid Italian lesson on food, café ordering, and meals is pre-loaded. Open it in the teacher studio to see every generated material, or jump straight into the arcade.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button render={<Link href={`/teacher/${DEMO_LESSON_ID}`} />} size="lg" variant="secondary" className="h-11 px-5 text-base">See the generated materials <ArrowRight /></Button>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon: Icon, title, body }: { icon: typeof Timer; title: string; body: string }) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-3 p-6">
        <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
          <Icon className="size-5" />
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}

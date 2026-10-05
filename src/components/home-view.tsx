"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Brand } from "@/components/brand"
import { Pip } from "@/components/pip"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { LANGUAGE_NAMES } from "@/lib/languages"
import { SAMPLES } from "@/lib/samples"
import { blankLesson, loadLessons, newId, saveLesson } from "@/lib/storage"
import { LEVELS, type LessonInput, type Level } from "@/lib/types"

export function HomeView() {
  const router = useRouter()
  const [draft, setDraft] = useState<LessonInput>(() => blankLesson())
  const [error, setError] = useState("")
  const [recent, setRecent] = useState<LessonInput[]>([])

  useEffect(() => {
    setRecent(loadLessons())
  }, [])

  function update(partial: Partial<LessonInput>) {
    setDraft((current) => ({ ...current, ...partial }))
    setError("")
  }

  function build() {
    if (draft.topic.trim().length < 2) {
      setError("Name the topic first. “Ordering lunch” is enough.")
      return
    }
    const lesson = {
      ...draft,
      id: newId(),
      title: draft.title.trim() || draft.topic.trim(),
      updatedAt: Date.now(),
    }
    saveLesson(lesson)
    router.push(`/studio/${lesson.id}`)
  }

  return (
    <main>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <Brand />
        <p className="hidden text-sm text-muted-foreground sm:block">For the lesson you already wrote</p>
      </header>
      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 pb-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-medium text-primary">ACTFL modes, can-do statements, and a room that does not stare</p>
          <h1 className="mt-2 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">They&apos;d rather play than perform.</h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Drop in a lesson. CanDo Arcade lines it up with proficiency level, the three modes of communication, and can-do statements, then deals out dozens of supplements. Speaking happens in private, behind a character, with one partner, or in chorus.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button render={<Link href="/studio/sample-market" />} className="h-11 px-4">
              Try the market lesson
            </Button>
            <Button variant="outline" className="h-11 px-4" onClick={() => document.getElementById("start")?.scrollIntoView({ behavior: "smooth" })}>
              Build from my lesson
            </Button>
          </div>
        </div>
        <div className="rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
          <div className="flex items-center gap-3">
            <Pip mood="listen" className="size-20" />
            <div>
              <p className="font-display text-2xl">Pip keeps the score</p>
              <p className="text-sm text-muted-foreground">Students talk to Pip, not to the class. The mic is optional. Typed lines count.</p>
            </div>
          </div>
          <ol className="mt-4 grid gap-2 text-sm">
            <li className="rounded-xl bg-secondary px-3 py-2">1. Word Sprint, no voice required</li>
            <li className="rounded-xl bg-secondary px-3 py-2">2. Build a line, then say it only if you want</li>
            <li className="rounded-xl bg-secondary px-3 py-2">3. Chorus, masks, then a private mission</li>
          </ol>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-3 px-4 pb-10 sm:grid-cols-3">
        {SAMPLES.map((sample) => (
          <Link key={sample.id} href={`/studio/${sample.id}`} className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10 hover:ring-primary/40">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {sample.language} · {sample.level}
            </p>
            <p className="mt-1 font-display text-2xl">{sample.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{sample.objective}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-10 md:grid-cols-4">
        {[
          ["Just you and Pip", "The class never hears it."],
          ["Behind a character", "The awkward line belongs to the mask."],
          ["One partner", "Every pair talks at once."],
          ["Everyone at once", "A freeze disappears into the chorus."],
        ].map(([title, copy]) => (
          <article key={title} className="rounded-2xl border border-dashed border-foreground/15 p-4">
            <h2 className="font-display text-xl">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
          </article>
        ))}
      </section>

      <section id="start" className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-16 lg:grid-cols-[1fr_280px]">
        <form
          className="grid gap-4 rounded-3xl bg-card p-5 ring-1 ring-foreground/10"
          onSubmit={(event) => {
            event.preventDefault()
            build()
          }}
        >
          <div>
            <h2 className="font-display text-3xl">Start from the lesson in your head</h2>
            <p className="mt-1 text-sm text-muted-foreground">Topic and a few words are enough. Grammar, culture, and the objective can wait for the desk.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Language">
              <Select
                value={draft.language}
                onValueChange={(value) => value && update({ language: value })}
                items={Object.fromEntries(LANGUAGE_NAMES.map((name) => [name, name]))}
              >
                <SelectTrigger className="w-full" aria-label="Language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_NAMES.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Proficiency target">
              <Select
                value={draft.level}
                onValueChange={(value) => value && update({ level: value as Level })}
                items={Object.fromEntries(LEVELS.map((level) => [level, level]))}
              >
                <SelectTrigger className="w-full" aria-label="Proficiency target">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Topic">
            <Input
              value={draft.topic}
              onChange={(event) => update({ topic: event.target.value })}
              placeholder="buying food at a market"
              aria-label="Topic"
              aria-invalid={Boolean(error)}
              className="h-10"
            />
          </Field>
          <Field label="Vocabulary" hint="One per line. Target language, then a dash, then English.">
            <Textarea
              value={draft.vocabulary}
              onChange={(event) => update({ vocabulary: event.target.value })}
              placeholder={"la manzana — apple\n¿cuánto cuesta? — how much does it cost"}
              aria-label="Vocabulary"
              className="min-h-28"
            />
          </Field>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="h-11 w-fit px-4">
            Deal the supplements
          </Button>
        </form>
        <aside className="grid content-start gap-3">
          <h2 className="font-display text-2xl">On this browser</h2>
          {recent.length === 0 && <p className="text-sm text-muted-foreground">Saved lessons will sit here. Nothing is uploaded.</p>}
          {recent.map((lesson) => (
            <Link key={lesson.id} href={`/studio/${lesson.id}`} className="rounded-2xl bg-card px-3 py-3 ring-1 ring-foreground/10">
              <span className="block font-medium">{lesson.title || lesson.topic}</span>
              <span className="text-sm text-muted-foreground">
                {lesson.language} · {lesson.level}
              </span>
            </Link>
          ))}
        </aside>
      </section>
      <footer className="mx-auto w-full max-w-6xl px-4 pb-8 text-xs text-muted-foreground">
        CanDo Arcade is an independent planning tool. It follows the shape of the ACTFL Proficiency Guidelines, the World-Readiness Standards for Learning Languages, and NCSSFL-ACTFL Can-Do Statements. It is not affiliated with or endorsed by ACTFL.
      </footer>
    </main>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Printer, Trash2 } from "lucide-react"
import { Brand } from "@/components/brand"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { C_COPY, MODE_COPY, SPOTLIGHT_COPY } from "@/lib/actfl"
import { packFor, LANGUAGE_NAMES } from "@/lib/languages"
import { buildDeck, deckToText, materialToText } from "@/lib/generate"
import { deleteLesson, getLesson, newId, saveLesson } from "@/lib/storage"
import { LEVELS, type LessonInput, type Level, type Material, type Mode } from "@/lib/types"

type Filter = "all" | "play" | "voice" | "quick" | Mode

export function StudioView({ lessonId }: { lessonId: string }) {
  const router = useRouter()
  const [lesson, setLesson] = useState<LessonInput | null>(null)
  const [missing, setMissing] = useState(false)
  const [ready, setReady] = useState(false)
  const [filter, setFilter] = useState<Filter>("all")
  const [panel, setPanel] = useState<"deck" | "lesson">("deck")
  const [open, setOpen] = useState<Material | null>(null)
  const [copied, setCopied] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const found = getLesson(lessonId)
    if (!found) {
      setMissing(true)
      setLesson(null)
    } else {
      setLesson(found)
      setMissing(false)
      if (found.topic.trim().length < 2) setPanel("lesson")
    }
    setReady(true)
  }, [lessonId])

  useEffect(() => {
    if (!lesson || lesson.id.startsWith("sample-")) return
    saveLesson(lesson)
  }, [lesson])

  const deck = useMemo(() => (lesson ? buildDeck(lesson) : null), [lesson])
  const pack = lesson ? packFor(lesson.language) : null

  function update(partial: Partial<LessonInput>) {
    setLesson((current) => (current ? { ...current, ...partial } : current))
  }

  async function copyText(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
    } catch {
      setCopied("fail")
    }
  }

  if (!ready) return <main className="p-6">Opening the desk…</main>

  if (missing || !lesson) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <Brand />
        <h1 className="mt-6 font-display text-4xl">That lesson is not on this browser.</h1>
        <Button render={<Link href="/" />} className="mt-4 h-11">
          Start one
        </Button>
      </main>
    )
  }

  const materials = deck?.materials.filter((item) => matchFilter(item, filter)) ?? []
  const nerves = /embarrass|freeze|nervous|shy|spotlight|anxious|shut down|dread|speaking/i.test(lesson.notes)
  const isSample = lesson.id.startsWith("sample-")

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Brand />
        <div className="flex flex-wrap gap-2">
          <Button render={<Link href={`/arcade/${lesson.id}`} />} variant="secondary" className="h-9">
            Student arcade
          </Button>
          <Button render={<Link href={`/print/${lesson.id}`} />} variant="outline" className="h-9">
            <Printer />
            Print deck
          </Button>
        </div>
      </header>

      <div className="mt-5 flex gap-2 lg:hidden">
        <Button type="button" variant={panel === "deck" ? "default" : "outline"} onClick={() => setPanel("deck")}>
          Deck
        </Button>
        <Button type="button" variant={panel === "lesson" ? "default" : "outline"} onClick={() => setPanel("lesson")}>
          Lesson
        </Button>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[320px_1fr]">
        <section className={panel === "deck" ? "hidden lg:block" : "block"}>
          <form
            className="grid gap-3 rounded-3xl bg-card p-4 ring-1 ring-foreground/10"
            onSubmit={(event) => {
              event.preventDefault()
              setPanel("deck")
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-2xl">The lesson</h2>
              {!isSample && (
                <Button type="button" variant="ghost" size="icon" onClick={() => setConfirmDelete(true)} aria-label="Delete lesson">
                  <Trash2 />
                </Button>
              )}
            </div>
            {isSample && <p className="text-xs text-muted-foreground">This is a sample. Save a copy before you rely on edits.</p>}
            <Field label="Title">
              <Input value={lesson.title} aria-label="Title" onChange={(event) => update({ title: event.target.value })} className="h-10" />
            </Field>
            <Field label="Language">
              <Select value={lesson.language} onValueChange={(value) => value && update({ language: value })} items={nameItems(LANGUAGE_NAMES)}>
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
              <Select value={lesson.level} onValueChange={(value) => value && update({ level: value as Level })} items={nameItems(LEVELS)}>
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
            <Field label="Topic">
              <Input value={lesson.topic} aria-label="Topic" onChange={(event) => update({ topic: event.target.value })} className="h-10" placeholder="What is the lesson about?" />
            </Field>
            <Field label="Your objective">
              <Textarea value={lesson.objective} aria-label="Your objective" onChange={(event) => update({ objective: event.target.value })} className="min-h-16" placeholder="I can…" />
            </Field>
            <Field label="Vocabulary" hint="Target language — English, one per line.">
              <Textarea value={lesson.vocabulary} aria-label="Vocabulary" onChange={(event) => update({ vocabulary: event.target.value })} className="min-h-32" />
            </Field>
            <Field label="Pattern you are teaching">
              <Input value={lesson.grammar} aria-label="Pattern you are teaching" onChange={(event) => update({ grammar: event.target.value })} className="h-10" />
            </Field>
            <Field label="Culture note">
              <Textarea value={lesson.culture} aria-label="Culture note" onChange={(event) => update({ culture: event.target.value })} className="min-h-16" />
            </Field>
            <Field label="What makes speaking hard in this class?">
              <Textarea value={lesson.notes} aria-label="What makes speaking hard in this class?" onChange={(event) => update({ notes: event.target.value })} className="min-h-16" />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" className="h-10">
                See the deck
              </Button>
              {isSample && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-10"
                  onClick={() => {
                    const copy = { ...lesson, id: newId(), title: lesson.title || lesson.topic, updatedAt: Date.now() }
                    saveLesson(copy)
                    router.push(`/studio/${copy.id}`)
                  }}
                >
                  Save my copy
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{isSample ? "Samples reset if you refresh." : "Saved in this browser. Nothing is uploaded."}</p>
          </form>
        </section>

        <section className={panel === "lesson" ? "hidden lg:block" : "block"}>
          {!deck && (
            <div className="rounded-3xl bg-card p-6 ring-1 ring-foreground/10">
              <h2 className="font-display text-3xl">Name the topic.</h2>
              <p className="mt-2 max-w-lg text-muted-foreground">
                Add a topic and, if you have them, the words. The deck builds can-do statements for all three modes and a stack of games and paper tasks from that.
              </p>
            </div>
          )}
          {deck && (
            <div className="grid gap-4">
              <div className="rounded-3xl bg-card p-4 ring-1 ring-foreground/10">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {lesson.language} · {lesson.level} · {deck.band}
                    </p>
                    <h1 className="font-display text-4xl tracking-tight">{lesson.title.trim() || lesson.topic}</h1>
                  </div>
                  <FrameworkButton />
                </div>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{deck.descriptor} Text type for this band: {deck.textType.toLowerCase()}.</p>
                {pack?.scriptNote && <p className="mt-2 text-sm text-muted-foreground">{pack.scriptNote}</p>}
                {lesson.objective.trim() && (
                  <p className="mt-3 text-sm">
                    <span className="font-medium">Your objective. </span>
                    {lesson.objective.trim()}
                  </p>
                )}
                <div className="mt-3 grid gap-2">
                  {(
                    [
                      ["Interpretive", deck.canDos.interpretive],
                      ["Interpersonal", deck.canDos.interpersonal],
                      ["Presentational", deck.canDos.presentational],
                    ] as const
                  ).map(([mode, statement]) => (
                    <p key={mode} className="rounded-xl px-3 py-2 text-sm" style={{ background: MODE_COPY[mode].soft }}>
                      <span className="font-medium" style={{ color: MODE_COPY[mode].color }}>
                        {mode}.{" "}
                      </span>
                      {statement}
                    </p>
                  ))}
                </div>
                {nerves && (
                  <p className="mt-3 rounded-xl bg-accent px-3 py-2 text-sm">
                    You flagged speaking nerves. The deck leads with private, mask, pair, and chorus tasks.
                  </p>
                )}
                <p className="mt-3 text-sm text-muted-foreground">
                  {deck.materials.length} supplements · {deck.materials.filter((item) => item.playable).length} playable ·{" "}
                  {deck.materials.filter((item) => item.quick).reduce((sum, item) => sum + item.minutes, 0)} minutes in the short set
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["all", "All"],
                    ["quick", "15-minute set"],
                    ["play", "Playable"],
                    ["voice", "Speaking, kept safe"],
                    ["Interpretive", "Interpretive"],
                    ["Interpersonal", "Interpersonal"],
                    ["Presentational", "Presentational"],
                  ] as const
                ).map(([id, label]) => (
                  <Button key={id} type="button" size="sm" variant={filter === id ? "default" : "outline"} onClick={() => setFilter(id)}>
                    {label}
                  </Button>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => copyText("deck", deckToText(lesson, deck))}
                >
                  <Copy />
                  {copied === "deck" ? "Copied" : "Copy plan"}
                </Button>
              </div>

              {materials.length === 0 && <p className="text-sm text-muted-foreground">Nothing in this drawer. Try All.</p>}

              <div className="grid gap-3 sm:grid-cols-2">
                {materials.map((material) => (
                  <button
                    key={material.id}
                    type="button"
                    onClick={() => setOpen(material)}
                    className="rounded-2xl bg-card p-4 text-left ring-1 ring-foreground/10 hover:ring-primary/40"
                  >
                    <span className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full px-2 py-0.5 font-medium" style={{ background: MODE_COPY[material.mode].soft, color: MODE_COPY[material.mode].color }}>
                        {material.mode}
                      </span>
                      <span className="text-muted-foreground">{SPOTLIGHT_COPY[material.spotlight].label}</span>
                      <span className="text-muted-foreground">{material.minutes} min</span>
                      {material.playable && <span className="text-primary">Play</span>}
                    </span>
                    <span className="mt-2 block font-display text-2xl leading-tight">{material.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{material.hook}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <Dialog open={Boolean(open)} onOpenChange={(value) => !value && setOpen(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{open.title}</DialogTitle>
                <DialogDescription>{open.hook}</DialogDescription>
              </DialogHeader>
              <p className="text-sm">{open.canDo}</p>
              <p className="text-sm text-muted-foreground">{open.whySafe}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {open.cs.map((item) => (
                  <span key={item} className="rounded-full bg-secondary px-2 py-1" title={C_COPY[item]}>
                    {item}
                  </span>
                ))}
              </div>
              <div>
                <p className="font-medium">How to run it</p>
                <ol className="mt-1 grid list-decimal gap-1 pl-5 text-sm">
                  {open.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
              <p className="text-sm">
                <span className="font-medium">Support. </span>
                {open.support}
              </p>
              <p className="text-sm">
                <span className="font-medium">Stretch. </span>
                {open.stretch}
              </p>
              <Handout blocks={open.handout} />
              <div className="flex flex-wrap gap-2">
                {open.playable && (
                  <Button render={<Link href={`/play/${lesson.id}/${open.id}`} />} className="h-10">
                    Play preview
                  </Button>
                )}
                <Button type="button" variant="outline" className="h-10" onClick={() => copyText(open.id, materialToText(open))}>
                  <Copy />
                  {copied === open.id ? "Copied" : "Copy this task"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this lesson?</DialogTitle>
            <DialogDescription>It leaves this browser. The sample lessons stay on the home page.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setConfirmDelete(false)}>
              Keep it
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                deleteLesson(lesson.id)
                router.push("/")
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

function matchFilter(material: Material, filter: Filter) {
  if (filter === "all") return true
  if (filter === "play") return material.playable
  if (filter === "voice") return material.spotlight !== "quiet"
  if (filter === "quick") return material.quick
  return material.mode === filter
}

function nameItems(values: readonly string[]) {
  return Object.fromEntries(values.map((value) => [value, value]))
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

function Handout({ blocks }: { blocks: Material["handout"] }) {
  return (
    <div className="grid gap-3">
      {blocks.map((block) => (
        <div key={block.kind === "note" ? block.text : block.title} className="rounded-xl bg-muted/60 p-3 text-sm">
          {block.kind === "note" && <p>{block.text}</p>}
          {block.kind === "list" && (
            <>
              <p className="font-medium">{block.title}</p>
              <ul className="mt-1 grid gap-1">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {block.kind === "table" && (
            <>
              <p className="font-medium">{block.title}</p>
              <div className="mt-2 grid gap-2">
                {block.rows.map((row) => (
                  <div key={row.join("|")} className="grid gap-1 sm:grid-cols-2">
                    <p>{row[0]}</p>
                    <p className="text-muted-foreground">{row[1]}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

function FrameworkButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        What this follows
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">What this follows</DialogTitle>
            <DialogDescription>A planning aid, not an official rating and not an ACTFL product.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 text-sm">
            <p>
              <span className="font-medium">Proficiency. </span>
              The level you picked sets the text type: words and memorized phrases, sentences, or paragraphs. Descriptors here are paraphrases of the ACTFL Proficiency Guidelines, not the guidelines themselves.
            </p>
            <p>
              <span className="font-medium">Communication. </span>
              Every supplement is tagged interpretive, interpersonal, or presentational, the three modes in the World-Readiness Standards.
            </p>
            <p>
              <span className="font-medium">The other standards. </span>
              Cultures, Connections, Comparisons, and Communities each have at least one task in the deck.
            </p>
            <p>
              <span className="font-medium">Can-do statements. </span>
              The “I can” lines are written in the style of the NCSSFL-ACTFL Can-Do Statements: performance targets for this lesson, not a certified rating.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

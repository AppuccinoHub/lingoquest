"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Brand } from "@/components/brand"
import { Button } from "@/components/ui/button"
import { MODE_COPY, SPOTLIGHT_COPY } from "@/lib/actfl"
import { buildDeck } from "@/lib/generate"
import { getLesson } from "@/lib/storage"
import type { Deck, LessonInput } from "@/lib/types"

export function PrintView({ lessonId }: { lessonId: string }) {
  const [lesson, setLesson] = useState<LessonInput | null>(null)
  const [deck, setDeck] = useState<Deck | null>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    const found = getLesson(lessonId)
    if (!found) {
      setMissing(true)
      return
    }
    setLesson(found)
    setDeck(buildDeck(found))
  }, [lessonId])

  if (missing) {
    return (
      <main className="p-6">
        <p>That lesson is not on this browser.</p>
        <Link href="/" className="underline">
          Home
        </Link>
      </main>
    )
  }

  if (!lesson || !deck) return <main className="p-6">Preparing the deck…</main>

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="no-print mb-4 flex items-center justify-between gap-3">
        <Brand href={`/studio/${lesson.id}`} />
        <Button type="button" onClick={() => window.print()}>
          Print
        </Button>
      </div>
      <header className="border-b pb-4">
        <p className="text-sm">
          {lesson.language} · {lesson.level}
        </p>
        <h1 className="font-display text-4xl">{lesson.title || lesson.topic}</h1>
        {lesson.objective && <p className="mt-2">{lesson.objective}</p>}
        <ul className="mt-3 grid gap-1 text-sm">
          <li>Interpretive: {deck.canDos.interpretive}</li>
          <li>Interpersonal: {deck.canDos.interpersonal}</li>
          <li>Presentational: {deck.canDos.presentational}</li>
        </ul>
      </header>
      <div className="mt-4 grid gap-4">
        {deck.materials.map((material) => (
          <article key={material.id} className="print-card rounded-xl border p-4">
            <p className="text-xs" style={{ color: MODE_COPY[material.mode].color }}>
              {material.mode} · {SPOTLIGHT_COPY[material.spotlight].label} · {material.minutes} min
              {material.quick ? " · 15-minute set" : ""}
              {material.playable ? " · playable in the arcade" : ""}
            </p>
            <h2 className="font-display text-2xl">{material.title}</h2>
            <p className="text-sm">{material.canDo}</p>
            <ol className="mt-2 list-decimal pl-5 text-sm">
              {material.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            {material.handout.map((block) => (
              <div key={block.kind === "note" ? block.text : block.title} className="mt-2 text-sm">
                {block.kind === "note" && <p>{block.text}</p>}
                {block.kind === "list" && (
                  <>
                    <p className="font-medium">{block.title}</p>
                    <ul className="list-disc pl-5">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
                {block.kind === "table" && (
                  <>
                    <p className="font-medium">{block.title}</p>
                    <ul className="list-disc pl-5">
                      {block.rows.map((row) => (
                        <li key={row.join("|")}>
                          {row[0]} — {row[1]}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </article>
        ))}
      </div>
    </main>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { SprintQuestion } from "@/lib/types"

export function WordSprint({
  questions,
  onComplete,
}: {
  questions: SprintQuestion[]
  onComplete: (extra: { badges: string[]; voice: boolean }) => void
}) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [combo, setCombo] = useState(0)
  const [best, setBest] = useState(0)
  const [chill, setChill] = useState(true)
  const [done, setDone] = useState(false)
  const question = questions[index]

  function choose(option: string) {
    if (picked || done) return
    setPicked(option)
    const hit = option === question.answer
    const nextCombo = hit ? combo + 1 : 0
    const nextBest = Math.max(best, nextCombo)
    setCombo(nextCombo)
    setBest(nextBest)
    window.setTimeout(() => {
      if (index + 1 >= questions.length) {
        setDone(true)
        onComplete({
          badges: ["quiet-start", ...(nextBest >= 5 ? ["combo"] : [])],
          voice: false,
        })
        return
      }
      setIndex((value) => value + 1)
      setPicked(null)
    }, chill ? 650 : 450)
  }

  if (!question && !done) return null

  if (done) {
    return (
      <div className="grid justify-items-center gap-2 py-8 text-center">
        <p className="font-display text-3xl">Sprint stamped.</p>
        <p className="text-muted-foreground">Best combo {best}. Nobody had to say a word.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span>
          {index + 1} / {questions.length}
        </span>
        <span>{combo > 1 ? `Combo ${combo}` : picked && picked !== question.answer ? "Combo resting" : "Combo ready"}</span>
        <Button type="button" variant={chill ? "secondary" : "outline"} size="sm" onClick={() => setChill((value) => !value)}>
          {chill ? "Chill mode on" : "Timer vibe on"}
        </Button>
      </div>
      <p className="font-display text-3xl leading-tight">{question.prompt}</p>
      <p className="text-sm text-muted-foreground">{question.hint}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {question.options.map((option) => {
          const show = picked !== null
          const correct = option === question.answer
          const mine = option === picked
          return (
            <Button
              key={option}
              type="button"
              variant="outline"
              className={`h-auto min-h-14 justify-start whitespace-normal px-4 py-3 text-left text-base ${
                show && correct ? "border-primary bg-primary/10" : ""
              } ${show && mine && !correct ? "border-destructive/40 bg-destructive/5" : ""}`}
              onClick={() => choose(option)}
            >
              {option}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { TicketQuestion } from "@/lib/types"

export function ExitTicket({
  questions,
  onComplete,
}: {
  questions: TicketQuestion[]
  onComplete: (extra: { badges: string[]; voice: boolean }) => void
}) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const question = questions[index]

  function choose(option: string) {
    if (picked) return
    setPicked(option)
  }

  function next() {
    if (index + 1 >= questions.length) {
      setDone(true)
      onComplete({ badges: ["pulse-check"], voice: false })
      return
    }
    setIndex((value) => value + 1)
    setPicked(null)
  }

  if (done) {
    return (
      <div className="grid justify-items-center gap-2 py-8 text-center">
        <p className="font-display text-3xl">Ticket stamped.</p>
        <p className="max-w-md text-muted-foreground">The last answer is a pulse, not a grade. Every choice counted.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        {index + 1} / {questions.length}
        {question.kind === "pulse" ? " · This one is not scored" : ""}
      </p>
      <p className="font-display text-3xl leading-tight">{question.prompt}</p>
      <div className="grid gap-2">
        {question.options.map((option) => {
          const show = picked !== null
          const correct = question.kind === "choice" && option === question.answer
          const mine = option === picked
          return (
            <Button
              key={option}
              type="button"
              variant="outline"
              className={`h-auto min-h-12 justify-start whitespace-normal px-4 py-3 text-left text-base ${
                show && question.kind === "choice" && correct ? "border-primary bg-primary/10" : ""
              } ${show && question.kind === "pulse" && mine ? "border-primary bg-primary/10" : ""} ${
                show && question.kind === "choice" && mine && !correct ? "border-destructive/40" : ""
              }`}
              onClick={() => choose(option)}
            >
              {option}
            </Button>
          )
        })}
      </div>
      {picked && question.kind === "choice" && picked !== question.answer && (
        <p className="text-sm text-muted-foreground">The match was: {question.answer}</p>
      )}
      {picked && question.kind === "pulse" && <p className="text-sm text-muted-foreground">Noted. That answer is enough.</p>}
      {picked && (
        <Button type="button" className="h-11 justify-self-start" onClick={next}>
          {index + 1 === questions.length ? "Stamp the ticket" : "Next"}
        </Button>
      )}
    </div>
  )
}

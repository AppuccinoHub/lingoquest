"use client"

import { useState } from "react"
import { Check, Keyboard, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { feedbackFor, scoreUtterance } from "@/lib/score"
import type { SayTurn } from "@/lib/types"
import { useMic } from "@/components/use-mic"

export function SayGame({
  intro,
  turns,
  bankOn,
  lang,
  badge = "pip-trust",
  onComplete,
}: {
  intro: string
  turns: SayTurn[]
  bankOn: boolean
  lang: string
  badge?: string
  onComplete: (extra: { badges: string[]; voice: boolean }) => void
}) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState("")
  const [note, setNote] = useState("")
  const [showBank, setShowBank] = useState(bankOn)
  const [usedVoice, setUsedVoice] = useState(false)
  const [done, setDone] = useState(false)
  const mic = useMic(lang)
  const turn = turns[index]

  function judge(value: string, borrowed = false) {
    if (borrowed) {
      setText(turn.model)
      setNote(`Using Pip's line counts. ${turn.model}`)
      return "ok" as const
    }
    const score = scoreUtterance(value, turn.model, turn.focus, turn.gloss)
    setNote(feedbackFor(score.tier, turn.model, score.caught))
    return score.tier
  }

  function next(passed: boolean) {
    if (!passed && !note) return
    if (index + 1 >= turns.length) {
      setDone(true)
      onComplete({ badges: [badge, ...(usedVoice ? ["first-voice"] : [])], voice: usedVoice })
      return
    }
    setIndex((value) => value + 1)
    setText("")
    setNote("")
  }

  if (done) {
    return (
      <div className="grid justify-items-center gap-3 py-8 text-center">
        <p className="font-display text-3xl">Stamp earned.</p>
        <p className="max-w-md text-muted-foreground">
          You held a scene without an audience. The rank on this device moved. Nothing was sent to the class.
        </p>
      </div>
    )
  }

  const tierReady = note.length > 0

  return (
    <div className="grid gap-5">
      <p className="text-sm text-muted-foreground">{intro}</p>
      <div className="flex items-center justify-between text-sm">
        <span>
          Turn {index + 1} of {turns.length}
        </span>
        <span className="text-muted-foreground">{turn.scene}</span>
      </div>
      <div className="rounded-2xl bg-secondary/70 px-4 py-5">
        <p className="font-display text-2xl leading-snug">{turn.task}</p>
        <p className="mt-2 text-sm text-muted-foreground">{turn.meaning}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant={showBank ? "secondary" : "outline"} onClick={() => setShowBank((value) => !value)}>
          {showBank ? "Hide word bank" : "Show word bank"}
        </Button>
        {showBank &&
          turn.bank.map((word) => (
            <span key={word} className="rounded-full bg-card px-2.5 py-1 text-sm ring-1 ring-foreground/10">
              {word}
            </span>
          ))}
      </div>
      <Textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Type the line, or use the mic."
        className="min-h-24 text-base"
        aria-label="Your line"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          className="h-11"
          disabled={mic.listening}
          onClick={() =>
            mic.listen((heard) => {
              setUsedVoice(true)
              setText(heard)
              const tier = judge(heard)
              if (tier === "ok" || tier === "strong") {
                window.setTimeout(() => next(true), 700)
              }
            })
          }
        >
          <Mic />
          {mic.listening ? "Listening…" : mic.supported ? "Say it to Pip" : "Mic unavailable"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="h-11"
          onClick={() => {
            const tier = judge(text)
            if (tier === "ok" || tier === "strong") next(true)
          }}
        >
          <Keyboard />
          Check what I typed
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={() => judge("", true)}>
          Use Pip&apos;s line
        </Button>
      </div>
      {mic.trouble !== "none" && (
        <p className="text-sm text-muted-foreground">
          {mic.trouble === "unsupported"
            ? "This browser can't hear you. Type the line, or borrow Pip's. Chrome usually has the mic."
            : "The mic stayed closed. Type the line instead. Pip still counts it."}
        </p>
      )}
      {tierReady && <p className="rounded-xl bg-card px-3 py-2 text-sm ring-1 ring-foreground/10">{note}</p>}
      {tierReady && (
        <Button type="button" variant="ghost" className="justify-self-start" onClick={() => next(true)}>
          <Check />
          Next turn
        </Button>
      )}
    </div>
  )
}

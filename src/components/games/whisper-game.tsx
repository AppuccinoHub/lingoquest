"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { WhisperCard } from "@/lib/types"

export function WhisperGame({
  cards,
  onComplete,
}: {
  cards: WhisperCard[]
  onComplete: (extra: { badges: string[]; voice: boolean }) => void
}) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)
  const card = cards[index]

  function next() {
    if (index + 1 >= cards.length) {
      setDone(true)
      onComplete({ badges: ["whisper-ok"], voice: false })
      return
    }
    setIndex((value) => value + 1)
    setFlipped(false)
  }

  if (done) {
    return (
      <div className="grid justify-items-center gap-2 py-8 text-center">
        <p className="font-display text-3xl">Cards cleared.</p>
        <p className="max-w-md text-muted-foreground">Practice the flip alone, then take the same cards to one partner. The room is not the audience.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        Card {index + 1} of {cards.length}. Flip it, say the back quietly, then move on.
      </p>
      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        className="min-h-48 rounded-3xl bg-card px-6 py-8 text-left ring-1 ring-foreground/10"
      >
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{flipped ? "Whisper this" : "Situation"}</p>
        <p className="mt-3 font-display text-3xl leading-tight">{flipped ? card.back : card.front}</p>
        {flipped && <p className="mt-3 text-sm text-muted-foreground">{card.meaning}</p>}
      </button>
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="h-11" onClick={() => setFlipped((value) => !value)}>
          {flipped ? "See the situation" : "Flip the card"}
        </Button>
        {flipped && (
          <Button type="button" className="h-11" onClick={next}>
            I whispered it
          </Button>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { ForgeLine } from "@/lib/types"

export function LineForge({
  lines,
  onComplete,
}: {
  lines: ForgeLine[]
  onComplete: (extra: { badges: string[]; voice: boolean }) => void
}) {
  const [index, setIndex] = useState(0)
  const [built, setBuilt] = useState<string[]>([])
  const [pool, setPool] = useState<string[]>(lines[0]?.chips ?? [])
  const [note, setNote] = useState("")
  const [said, setSaid] = useState(false)
  const [done, setDone] = useState(false)
  const line = lines[index]

  function load(nextIndex: number) {
    setIndex(nextIndex)
    setBuilt([])
    setPool(lines[nextIndex].chips)
    setNote("")
    setSaid(false)
  }

  function push(word: string, from: number) {
    setBuilt((current) => [...current, word])
    setPool((current) => current.filter((_, chipIndex) => chipIndex !== from))
    setNote("")
  }

  function pop(from: number) {
    const word = built[from]
    setBuilt((current) => current.filter((_, chipIndex) => chipIndex !== from))
    setPool((current) => [...current, word])
    setNote("")
  }

  function check() {
    const good = built.join(" ") === line.answer.join(" ")
    setNote(good ? "That line holds." : `Pip would say: ${line.model}`)
    return good
  }

  function advance() {
    if (index + 1 >= lines.length) {
      setDone(true)
      onComplete({ badges: ["line-maker"], voice: false })
      return
    }
    load(index + 1)
  }

  if (done) {
    return (
      <div className="grid justify-items-center gap-2 py-8 text-center">
        <p className="font-display text-3xl">Lines forged.</p>
        <p className="max-w-md text-muted-foreground">You built them before you had to say them. That order matters.</p>
      </div>
    )
  }

  if (!line) return null

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        Line {index + 1} of {lines.length}
      </p>
      <p className="font-display text-3xl leading-tight">{line.meaning}</p>
      <div className="min-h-16 rounded-2xl bg-secondary/70 px-3 py-3">
        <div className="flex flex-wrap gap-2">
          {built.length === 0 && <span className="text-sm text-muted-foreground">Tap the chips in order.</span>}
          {built.map((word, chipIndex) => (
            <Button key={`${word}-${chipIndex}`} type="button" variant="secondary" className="h-10" onClick={() => pop(chipIndex)}>
              {word}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {pool.map((word, chipIndex) => (
          <Button key={`${word}-${chipIndex}`} type="button" variant="outline" className="h-10" onClick={() => push(word, chipIndex)}>
            {word}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" className="h-11" onClick={check}>
          Check the line
        </Button>
        {note.startsWith("That line") && !said && (
          <Button type="button" variant="secondary" className="h-11" onClick={() => setSaid(true)}>
            I said it quietly
          </Button>
        )}
        {note && (
          <Button type="button" variant="outline" className="h-11" onClick={advance}>
            Next line
          </Button>
        )}
      </div>
      {said && <p className="text-sm text-muted-foreground">Counted. Only you heard it.</p>}
      {note && <p className="text-sm">{note}</p>}
    </div>
  )
}

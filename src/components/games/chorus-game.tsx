"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import type { ChorusLine } from "@/lib/types"

export function ChorusGame({
  lines,
  onComplete,
}: {
  lines: ChorusLine[]
  onComplete: (extra: { badges: string[]; voice: boolean }) => void
}) {
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState<number | null>(null)
  const [show, setShow] = useState(false)
  const [done, setDone] = useState(false)
  const line = lines[index]

  useEffect(() => {
    if (count === null) return
    if (count <= 0) {
      setShow(true)
      return
    }
    const timer = window.setTimeout(() => setCount((value) => (value === null ? null : value - 1)), 700)
    return () => window.clearTimeout(timer)
  }, [count])

  function arm() {
    setShow(false)
    setCount(3)
  }

  function next() {
    if (index + 1 >= lines.length) {
      setDone(true)
      onComplete({ badges: ["in-chorus"], voice: false })
      return
    }
    setIndex((value) => value + 1)
    setShow(false)
    setCount(null)
  }

  if (done) {
    return (
      <div className="grid justify-items-center gap-2 py-8 text-center">
        <p className="font-display text-3xl">Chorus closed.</p>
        <p className="text-muted-foreground">Every line had the whole room on it.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        Line {index + 1} of {lines.length}. You say the call. The class answers together. Keep your eyes on the screen.
      </p>
      <div className="rounded-3xl bg-[#1c2430] px-6 py-10 text-center text-[#f6f1e7]">
        <p className="text-sm uppercase tracking-[0.18em] text-[#f0c14a]">Call</p>
        <p className="mt-2 font-display text-2xl">{line.call}</p>
        <p className="mt-8 text-sm uppercase tracking-[0.18em] text-[#f0c14a]">Class</p>
        {count !== null && count > 0 && <p className="mt-3 font-display text-7xl">{count}</p>}
        {show && <p className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{line.response}</p>}
        {!show && count === null && <p className="mt-3 text-lg text-[#f6f1e7]/70">Ready when you are.</p>}
        {show && <p className="mt-4 text-sm text-[#f6f1e7]/70">{line.meaning}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" className="h-11" onClick={arm}>
          Start countdown
        </Button>
        {show && (
          <Button type="button" variant="secondary" className="h-11" onClick={next}>
            We said it
          </Button>
        )}
      </div>
    </div>
  )
}

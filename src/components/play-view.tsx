"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Brand } from "@/components/brand"
import { ChorusGame } from "@/components/games/chorus-game"
import { ExitTicket } from "@/components/games/exit-ticket"
import { LineForge } from "@/components/games/line-forge"
import { SayGame } from "@/components/games/say-game"
import { WhisperGame } from "@/components/games/whisper-game"
import { WordSprint } from "@/components/games/word-sprint"
import { Pip } from "@/components/pip"
import { Button } from "@/components/ui/button"
import { rankFor, SPOTLIGHT_COPY } from "@/lib/actfl"
import { packFor } from "@/lib/languages"
import { buildDeck } from "@/lib/generate"
import { award, getLesson, readProgress, type Progress } from "@/lib/storage"
import type { MaskPlay, Material } from "@/lib/types"

export function PlayView({ lessonId, materialId }: { lessonId: string; materialId: string }) {
  const [ready, setReady] = useState(false)
  const [material, setMaterial] = useState<Material | null>(null)
  const [missing, setMissing] = useState(false)
  const [language, setLanguage] = useState("Spanish")
  const [progress, setProgress] = useState<Progress | null>(null)
  const [gain, setGain] = useState<number | null>(null)
  const awarded = useRef(false)

  useEffect(() => {
    const lesson = getLesson(lessonId)
    if (!lesson) {
      setMissing(true)
      setReady(true)
      return
    }
    const deck = buildDeck(lesson)
    const found = deck?.materials.find((item) => item.id === materialId) ?? null
    setMaterial(found)
    setMissing(!found)
    setLanguage(lesson.language)
    setProgress(readProgress(lessonId))
    setReady(true)
  }, [lessonId, materialId])

  function onComplete(extra: { badges: string[]; voice: boolean }) {
    if (awarded.current || !material) return
    awarded.current = true
    const result = award(lessonId, material.id, material.xp, extra.badges, extra.voice)
    setProgress(result.progress)
    setGain(result.gain)
  }

  if (!ready) {
    return <Shell lessonId={lessonId} title="Loading" />
  }

  if (missing || !material) {
    return (
      <Shell lessonId={lessonId} title="Missing game" kicker="Arcade">
        <p>That game is not on this lesson.</p>
        <Button render={<Link href={`/arcade/${lessonId}`} />} className="mt-4 h-11">
          Back to the arcade
        </Button>
      </Shell>
    )
  }

  const rank = rankFor(progress?.xp ?? 0)

  return (
    <Shell
      lessonId={lessonId}
      title={material.title}
      kicker={SPOTLIGHT_COPY[material.spotlight].label}
      xp={progress?.xp ?? 0}
      rank={rank.current.name}
    >
      <p className="text-sm text-muted-foreground">{material.whySafe}</p>
      {material.play?.type === "sprint" && <WordSprint questions={material.play.questions} onComplete={onComplete} />}
      {material.play?.type === "mission" && (
        <SayGame
          intro={material.play.intro}
          turns={material.play.turns}
          bankOn={material.play.bankOn}
          lang={packFor(language).bcp47}
          onComplete={onComplete}
        />
      )}
      {material.play?.type === "forge" && <LineForge lines={material.play.lines} onComplete={onComplete} />}
      {material.play?.type === "chorus" && <ChorusGame lines={material.play.lines} onComplete={onComplete} />}
      {material.play?.type === "cards" && <WhisperGame cards={material.play.cards} onComplete={onComplete} />}
      {material.play?.type === "ticket" && <ExitTicket questions={material.play.questions} onComplete={onComplete} />}
      {material.play?.type === "mask" && (
        <MaskRouter
          intro={material.play.intro}
          masks={material.play.masks}
          bankOn={material.play.bankOn}
          lang={packFor(language).bcp47}
          onComplete={onComplete}
        />
      )}
      {!material.play && (
        <div className="grid gap-3">
          <p>Your teacher runs this one in the room. You can still read the student side.</p>
          {material.handout.map((block) => (
            <div key={block.kind === "note" ? block.text : block.title} className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
              {block.kind === "note" && <p>{block.text}</p>}
              {block.kind === "list" && (
                <>
                  <p className="font-medium">{block.title}</p>
                  <ul className="mt-2 grid gap-1">
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
              {block.kind === "table" && (
                <>
                  <p className="font-medium">{block.title}</p>
                  <ul className="mt-2 grid gap-2">
                    {block.rows.map((row) => (
                      <li key={row.join("|")}>
                        <span className="text-muted-foreground">{row[0]}</span>
                        <span className="mx-2">→</span>
                        {row[1]}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {gain !== null && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-primary/10 px-4 py-3">
          <Pip mood="cheer" className="size-12" />
          <div>
            <p className="font-medium">+{gain} XP · {rankFor(progress?.xp ?? 0).current.name}</p>
            <p className="text-sm text-muted-foreground">Saved on this device only.</p>
          </div>
        </div>
      )}
    </Shell>
  )
}

function MaskRouter({
  intro,
  masks,
  bankOn,
  lang,
  onComplete,
}: {
  intro: string
  masks: MaskPlay[]
  bankOn: boolean
  lang: string
  onComplete: (extra: { badges: string[]; voice: boolean }) => void
}) {
  const [mask, setMask] = useState<MaskPlay | null>(null)
  if (!mask) {
    return (
      <div className="grid gap-3">
        <p>{intro}</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {masks.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setMask(item)}
              className="rounded-2xl bg-card p-4 text-left ring-1 ring-foreground/10 hover:ring-primary/40"
            >
              <p className="font-display text-2xl">{item.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.role}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }
  return (
    <SayGame
      intro={`${mask.name} is talking. ${mask.role}`}
      turns={mask.turns}
      bankOn={bankOn}
      lang={lang}
      badge="mask-on"
      onComplete={onComplete}
    />
  )
}

function Shell({
  lessonId,
  title,
  kicker = "Arcade",
  xp,
  rank,
  children,
}: {
  lessonId: string
  title: string
  kicker?: string
  xp?: number
  rank?: string
  children?: React.ReactNode
}) {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-3xl gap-6 px-4 py-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Brand href={`/arcade/${lessonId}`} />
        <div className="text-right text-sm">
          <p className="font-medium">{rank ?? "Arcade"}</p>
          {typeof xp === "number" && <p className="text-muted-foreground">{xp} XP</p>}
        </div>
      </header>
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{kicker}</p>
        <h1 className="font-display text-4xl tracking-tight">{title}</h1>
      </div>
      {children}
    </main>
  )
}

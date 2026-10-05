"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Brand } from "@/components/brand"
import { Pip } from "@/components/pip"
import { Badge } from "@/components/ui/badge"
import { Progress as XpBar } from "@/components/ui/progress"
import { BADGES, rankFor, SPOTLIGHT_COPY } from "@/lib/actfl"
import { buildDeck } from "@/lib/generate"
import { getLesson, readProgress, type Progress } from "@/lib/storage"
import { CAMPAIGN_IDS, type Material } from "@/lib/types"

export function ArcadeView({ lessonId }: { lessonId: string }) {
  const [ready, setReady] = useState(false)
  const [title, setTitle] = useState("")
  const [language, setLanguage] = useState("")
  const [games, setGames] = useState<Material[]>([])
  const [progress, setProgress] = useState<Progress>({ xp: 0, completed: [], badges: [], voiceUsed: false })
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    const lesson = getLesson(lessonId)
    if (!lesson) {
      setMissing(true)
      setReady(true)
      return
    }
    const deck = buildDeck(lesson)
    const playable = deck?.materials.filter((item) => item.playable) ?? []
    const ordered = CAMPAIGN_IDS.map((id) => playable.find((item) => item.id === id)).filter((item): item is Material => Boolean(item))
    setTitle(lesson.title.trim() || lesson.topic)
    setLanguage(`${lesson.language} · ${lesson.level}`)
    setGames(ordered)
    setProgress(readProgress(lessonId))
    setReady(true)
  }, [lessonId])

  if (!ready) return <main className="p-6">Opening the arcade…</main>
  if (missing) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <Brand />
        <p className="mt-6">This arcade is not on this browser.</p>
        <Link href="/" className="mt-4 inline-block underline">
          Go home
        </Link>
      </main>
    )
  }

  const rank = rankFor(progress.xp)
  const span = rank.next ? rank.next.xp - rank.current.xp : 1
  const into = rank.next ? progress.xp - rank.current.xp : 1
  const value = rank.next ? Math.min(100, Math.round((into / span) * 100)) : 100

  return (
    <main className="mx-auto grid w-full max-w-3xl gap-6 px-4 py-5">
      <header className="flex items-center justify-between gap-3">
        <Brand />
        <Link href={`/studio/${lessonId}`} className="text-sm underline-offset-4 hover:underline">
          Teacher desk
        </Link>
      </header>
      <section className="grid gap-4 rounded-3xl bg-card p-5 ring-1 ring-foreground/10 sm:grid-cols-[auto_1fr] sm:items-center">
        <Pip mood="cheer" className="size-24" />
        <div className="grid gap-2">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{language}</p>
          <h1 className="font-display text-4xl tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">
            Your voice stays in this room. There is no class scoreboard. The path starts quiet and only asks you to talk once the words are already in your hands.
          </p>
          <div className="mt-1">
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">{rank.current.name}</span>
              <span className="text-muted-foreground">{progress.xp} XP{rank.next ? ` · ${rank.next.xp - progress.xp} to ${rank.next.name}` : ""}</span>
            </div>
            <XpBar value={value} />
          </div>
        </div>
      </section>
      <ol className="grid gap-3">
        {games.map((game, index) => {
          const done = progress.completed.includes(game.id)
          return (
            <li key={game.id}>
              <Link
                href={`/play/${lessonId}/${game.id}`}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-card px-4 py-4 ring-1 ring-foreground/10 hover:ring-primary/40"
              >
                <span className="grid size-10 place-items-center rounded-full bg-secondary font-display text-lg">{done ? "✓" : index + 1}</span>
                <span>
                  <span className="block font-display text-2xl leading-none">{game.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {SPOTLIGHT_COPY[game.spotlight].label} · {game.minutes} min · {game.xp} XP
                  </span>
                </span>
                <span className="text-sm">{done ? "Replay" : "Play"}</span>
              </Link>
            </li>
          )
        })}
      </ol>
      <section>
        <h2 className="font-display text-2xl">Badge case</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {progress.badges.length === 0 && <p className="text-sm text-muted-foreground">Clear a game and the first badge lands here.</p>}
          {progress.badges.map((id) => (
            <Badge key={id} variant="secondary" className="h-auto px-2 py-1 whitespace-normal">
              {BADGES[id]?.name ?? id}
              <span className="text-muted-foreground"> — {BADGES[id]?.detail}</span>
            </Badge>
          ))}
        </div>
      </section>
    </main>
  )
}

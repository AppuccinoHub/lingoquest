"use client"

import { useEffect, useState } from "react"

type Rec = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}

function recognitionCtor() {
  if (typeof window === "undefined") return null
  const host = window as Window & {
    SpeechRecognition?: new () => Rec
    webkitSpeechRecognition?: new () => Rec
  }
  return host.SpeechRecognition ?? host.webkitSpeechRecognition ?? null
}

export function useMic(lang: string) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [trouble, setTrouble] = useState<"none" | "unsupported" | "blocked">("none")

  useEffect(() => {
    setSupported(Boolean(recognitionCtor()))
  }, [])

  function listen(onText: (text: string) => void) {
    const Ctor = recognitionCtor()
    if (!Ctor) {
      setTrouble("unsupported")
      return
    }
    const rec = new Ctor()
    rec.lang = lang
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript ?? ""
      if (text) onText(text)
    }
    rec.onerror = () => setTrouble("blocked")
    rec.onend = () => setListening(false)
    setTrouble("none")
    setListening(true)
    try {
      rec.start()
    } catch {
      setListening(false)
      setTrouble("blocked")
    }
  }

  return { supported, listening, trouble, listen }
}

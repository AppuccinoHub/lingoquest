import type { Vocab } from "@/lib/types"

export function parseVocab(raw: string): Vocab[] {
  const chunks = raw
    .split(/[\n,;]+/)
    .map((part) => part.trim())
    .filter(Boolean)

  const items: Vocab[] = []
  for (const chunk of chunks) {
    const match = chunk.match(/^(.+?)\s*(?:[-–—:|=]|\/)\s*(.+)$/)
    if (match && match[1].trim().length <= 80 && match[2].trim().length <= 80) {
      items.push({ term: stripEdges(match[1]), gloss: stripEdges(match[2]) })
    } else {
      items.push({ term: stripEdges(chunk), gloss: "" })
    }
  }

  const seen = new Set<string>()
  return items
    .filter((item) => {
      const key = item.term.toLowerCase()
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, 24)
}

function stripEdges(value: string) {
  return value.replace(/^[\s("']+|[\s)"']+$/g, "").trim()
}

export function isContentWord(item: Vocab) {
  if (/[?¿]/.test(item.term)) return false
  if (/how much|please|thank|hello|goodbye|i want|my name|and you|do you have|too expensive|i'm late|glad|excuse me/i.test(item.gloss)) {
    return false
  }
  return true
}

export function showVocab(item: Vocab) {
  return item.gloss ? `${item.term} — ${item.gloss}` : item.term
}

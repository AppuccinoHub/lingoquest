import { makeContext } from "@/lib/context"
import { buildPlans } from "@/lib/plans"
import { buildPlayables } from "@/lib/playables"
import type { Deck, HandoutBlock, LessonInput, Material } from "@/lib/types"

export function buildDeck(lesson: LessonInput): Deck | null {
  const ctx = makeContext(lesson)
  if (!ctx) return null
  const materials = [...buildPlayables(ctx), ...buildPlans(ctx)]
  return {
    canDos: ctx.canDos,
    band: ctx.band,
    descriptor: ctx.descriptor,
    textType: ctx.textType,
    materials,
  }
}

export function deckToText(lesson: LessonInput, deck: Deck) {
  const title = lesson.title.trim() || lesson.topic.trim()
  const lines = [
    `${title} — ${lesson.language} — ${lesson.level}`,
    lesson.objective.trim() ? `Objective: ${lesson.objective.trim()}` : "",
    `Interpretive: ${deck.canDos.interpretive}`,
    `Interpersonal: ${deck.canDos.interpersonal}`,
    `Presentational: ${deck.canDos.presentational}`,
    "",
    `${deck.materials.length} supplements`,
    "",
  ]
  for (const material of deck.materials) {
    lines.push(`${material.quick ? "[15-min set] " : ""}${material.title} (${material.minutes} min, ${material.mode}, ${material.spotlight})`)
    lines.push(material.canDo)
    for (const step of material.steps) lines.push(`- ${step}`)
    lines.push("")
  }
  return lines.filter((line, index, all) => line !== "" || all[index - 1] !== "").join("\n")
}

export function materialToText(material: Material) {
  const lines = [material.title, material.canDo, "", ...material.steps.map((step) => `- ${step}`), ""]
  for (const block of material.handout) lines.push(blockToText(block), "")
  return lines.join("\n").trim()
}

function blockToText(block: HandoutBlock) {
  if (block.kind === "note") return block.text
  if (block.kind === "list") return [block.title, ...block.items.map((item) => `• ${item}`)].join("\n")
  const rows = block.rows.map((row) => `${row[0]}  |  ${row[1]}`)
  return [block.title, block.columns.join("  |  "), ...rows].join("\n")
}

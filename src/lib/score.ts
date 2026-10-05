export type ScoreTier = "empty" | "english" | "miss" | "partial" | "ok" | "strong"

export function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function scoreUtterance(input: string, model: string, focus: string, gloss = "") {
  const said = normalize(input)
  const modelN = normalize(model)
  const focusN = normalize(focus)
  const glossN = normalize(gloss)

  if (!said) return { tier: "empty" as ScoreTier, caught: [] as string[] }
  if (glossN && said === glossN) return { tier: "english" as ScoreTier, caught: [] as string[] }

  const modelTokens = modelN.split(" ").filter((token) => token.length > 1)
  const caught = modelTokens.filter((token) => said.includes(token))
  const ratio = modelTokens.length ? caught.length / modelTokens.length : 0
  const focusTokens = focusN.split(" ").filter((token) => token.length > 1)
  const hasFocus = focusN
    ? said.includes(focusN) || (focusTokens.length > 0 && focusTokens.every((token) => said.includes(token)))
    : false

  if (said === modelN || (modelTokens.length > 0 && ratio >= 0.8)) {
    return { tier: "strong" as ScoreTier, caught }
  }
  if (hasFocus || ratio >= 0.45) return { tier: "ok" as ScoreTier, caught }
  if (ratio >= 0.2 || caught.length > 0) return { tier: "partial" as ScoreTier, caught }
  return { tier: "miss" as ScoreTier, caught }
}

export function feedbackFor(tier: ScoreTier, model: string, caught: string[]) {
  if (tier === "empty") return "Say or type a line first."
  if (tier === "english") return `That's the English meaning. Pip needs the class language: ${model}`
  if (tier === "strong") return "Pip got that."
  if (tier === "ok") {
    const heard = caught.slice(0, 4).join(", ")
    return heard ? `Pip caught: ${heard}. That counts.` : "That counts."
  }
  if (tier === "partial") return `Pip heard a piece. A line that works: ${model}`
  return `Not yet. Try this line, then make it yours: ${model}`
}

import { SAMPLES } from "../src/lib/samples"
import { buildDeck } from "../src/lib/generate"
import { scoreUtterance } from "../src/lib/score"

let failed = false

function assert(condition: boolean, message: string) {
  if (!condition) {
    failed = true
    console.error(message)
  }
}

for (const sample of SAMPLES) {
  const deck = buildDeck(sample)
  assert(Boolean(deck), `${sample.id} deck`)
  if (!deck) continue
  assert(deck.materials.length >= 30, `${sample.id} count ${deck.materials.length}`)
  const ids = new Set(deck.materials.map((item) => item.id))
  assert(ids.size === deck.materials.length, `${sample.id} duplicate ids`)
  const playable = deck.materials.filter((item) => item.playable)
  assert(playable.length >= 7, `${sample.id} playable ${playable.length}`)
  for (const material of deck.materials) {
    assert(material.steps.length > 0 && material.canDo.length > 0 && material.whySafe.length > 0, material.id)
    if (material.playable) assert(Boolean(material.play), `${material.id} missing play`)
  }
  const sprint = deck.materials.find((item) => item.id === "word-sprint")
  if (sprint?.play?.type === "sprint") {
    assert(sprint.play.questions.length >= 8, "sprint length")
    for (const question of sprint.play.questions) {
      assert(question.options.includes(question.answer), `sprint answer missing: ${question.prompt}`)
      assert(new Set(question.options).size === question.options.length, `sprint dup options: ${question.prompt}`)
    }
  }
}

const strong = scoreUtterance("Quiero el pan, por favor.", "Quiero el pan, por favor.", "el pan", "bread")
assert(strong.tier === "strong", `expected strong, got ${strong.tier}`)

const focus = scoreUtterance("el pan", "Quiero el pan, por favor.", "el pan", "bread")
assert(focus.tier === "ok" || focus.tier === "strong", `expected ok, got ${focus.tier}`)

const english = scoreUtterance("bread", "Quiero el pan, por favor.", "el pan", "bread")
assert(english.tier === "english", `expected english, got ${english.tier}`)

const empty = buildDeck({ ...SAMPLES[0], topic: " " })
assert(empty === null, "blank topic should not build")

if (failed) process.exit(1)
console.log(`ok ${buildDeck(SAMPLES[0])?.materials.length} supplements in the market deck`)

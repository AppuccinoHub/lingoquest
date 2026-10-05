import { at, bankFor, labelOf, line, meaningOf, shuffle, unique, type Ctx } from "@/lib/context"
import type { ChorusLine, ForgeLine, MaskPlay, Material, SayTurn, SprintQuestion, TicketQuestion, WhisperCard } from "@/lib/types"

export function buildPlayables(ctx: Ctx): Material[] {
  return [
    wordSprint(ctx),
    pipMission(ctx),
    lineForge(ctx),
    chorus(ctx),
    maskQuest(ctx),
    whisperCards(ctx),
    exitTicket(ctx),
  ]
}

function wordSprint(ctx: Ctx): Material {
  const questions = sprintQuestions(ctx)
  return {
    id: "word-sprint",
    title: "Word Sprint",
    hook: "Recognition first, so the voice never has to open cold.",
    kind: "sprint",
    mode: "Interpretive",
    cs: ["Communication"],
    canDo: ctx.canDos.interpretive,
    minutes: 4,
    spotlight: "quiet",
    playable: true,
    quick: true,
    xp: 30,
    whySafe: "Nobody speaks. A miss only resets a combo, and Chill mode has no timer.",
    steps: [
      "Project the arcade or hand out devices. Leave Chill mode on unless the class asks for a timer.",
      "Students tap the match. The prompt is the meaning; the choices are the class language.",
      "When the stamp shows, they stop. Do not have them read answers aloud.",
    ],
    support: "Chill mode stays on, and the hint names the job of the word (price, greeting, item).",
    stretch: "Turn the timer on. After the game, students write one new match the deck did not ask.",
    handout: [
      {
        kind: "list",
        title: "Paper version, if devices are put away",
        items: questions.slice(0, 6).map((question, index) => `${index + 1}. ${question.prompt}  ( ${question.answer} )`),
      },
    ],
    play: { type: "sprint", questions },
  }
}

function sprintQuestions(ctx: Ctx): SprintQuestion[] {
  const pool = uniquePool(ctx)
  const questions: SprintQuestion[] = []

  pool.forEach((item, index) => {
    if (!item.gloss || questions.length >= 8) return
    const distractors = shuffle(
      pool.filter((other) => other.term !== item.term).map((other) => other.term),
      ctx.rng,
    ).slice(0, 3)
    while (distractors.length < 3) {
      distractors.push(ctx.pack.hello)
    }
    questions.push({
      prompt: `Which one means “${item.gloss}”?`,
      options: shuffle([item.term, ...distractors.slice(0, 3)], ctx.rng),
      answer: item.term,
      hint: `About ${ctx.topic}.`,
    })
    if (index % 2 === 0 && questions.length < 10) {
      const glossOptions = shuffle(
        unique([item.gloss, ...pool.map((other) => other.gloss).filter(Boolean)]).slice(0, 4),
        ctx.rng,
      )
      if (glossOptions.length >= 3 && glossOptions.includes(item.gloss)) {
        questions.push({
          prompt: `What does “${item.term}” mean?`,
          options: glossOptions.slice(0, 4),
          answer: item.gloss,
          hint: "Pick the English.",
        })
      }
    }
  })

  const functions: SprintQuestion[] = [
    {
      prompt: "Which line asks the price?",
      options: shuffle([line(ctx, "howMuch", 0), line(ctx, "want", 1), line(ctx, "like", 2), ctx.pack.hello], ctx.rng),
      answer: line(ctx, "howMuch", 0),
      hint: "You are asking, not naming.",
    },
    {
      prompt: "Which line says you want something?",
      options: shuffle([line(ctx, "want", 0), line(ctx, "where", 1), ctx.pack.goodbye, ctx.pack.tooMuch], ctx.rng),
      answer: line(ctx, "want", 0),
      hint: "A request, not a goodbye.",
    },
    {
      prompt: "Which line is a polite repair?",
      options: shuffle([ctx.pack.repair, ctx.pack.thanks, line(ctx, "have", 2), ctx.pack.yes], ctx.rng),
      answer: ctx.pack.repair,
      hint: "Use this when you did not hear.",
    },
  ]

  for (const question of functions) {
    if (questions.length >= 10) break
    if (!questions.some((existing) => existing.prompt === question.prompt)) questions.push(question)
  }

  return questions.slice(0, 10)
}

function uniquePool(ctx: Ctx) {
  const base = ctx.vocab.length ? ctx.vocab : ctx.pool
  const seen = new Set<string>()
  return base.filter((item) => {
    const key = item.term.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function pipMission(ctx: Ctx): Material {
  const turns = missionTurns(ctx)
  return {
    id: "pip-mission",
    title: "Pip's Private Mission",
    hook: "A full exchange, said only to the mascot.",
    kind: "mission",
    mode: "Interpersonal",
    cs: ["Communication"],
    canDo: ctx.objective || ctx.canDos.interpersonal,
    minutes: 5,
    spotlight: "private",
    playable: true,
    quick: true,
    xp: 50,
    whySafe: "Pip is the only listener. Students may type, speak, or borrow the model line. Borrowing still counts at this band.",
    steps: [
      `Tell the class Pip is playing ${ctx.partner}. Headphones are optional. Public playback is off the table.`,
      "They move through the scene one turn at a time. A borrowed model line is a valid Novice move and still earns a stamp.",
      "Glance at stamps, not at recordings. Do not collect audio unless your course already has a private-recording routine.",
    ],
    support: "Leave the word bank on. Accept the model line as success.",
    stretch: ctx.band === "Novice"
      ? "Ask them to add one extra word from the bank after the model."
      : "Hide the model until they try once. Then they may open it.",
    handout: [
      {
        kind: "list",
        title: "The scene, if you run it without devices",
        items: turns.map((turn, index) => `${index + 1}. ${turn.task}  →  ${turn.model}`),
      },
      { kind: "note", text: "Sit pairs back to back only if you must leave the screen. They still whisper, they do not present." },
    ],
    play: {
      type: "mission",
      intro: `Pip is playing ${ctx.partner}. This stays between you and Pip. Nothing is sent to the class.`,
      bankOn: ctx.band !== "Advanced",
      turns,
    },
  }
}

function missionTurns(ctx: Ctx): SayTurn[] {
  const turns: SayTurn[] = [
    say(ctx, 0, `Greet ${ctx.partner}.`, ctx.pack.hello, "Say hello", ctx.pack.hello, ""),
    say(ctx, 1, `Say what you want.`, line(ctx, "want", 0), meaningOf(ctx, "want", 0), at(ctx, 0).term, at(ctx, 0).gloss),
    say(ctx, 2, `Ask the price or where it is.`, line(ctx, "howMuch", 1), meaningOf(ctx, "howMuch", 1), at(ctx, 1).term, at(ctx, 1).gloss),
  ]

  if (ctx.band === "Novice") {
    turns.push(
      say(ctx, 3, "Say that you like one item.", line(ctx, "like", 2), meaningOf(ctx, "like", 2), at(ctx, 2).term, at(ctx, 2).gloss),
      say(
        ctx,
        4,
        "Add please, then thank them.",
        `${line(ctx, "want", 3)}, ${ctx.pack.please}. ${ctx.pack.thanks}.`,
        `I want ${labelOf(at(ctx, 3))}, please. Thank you.`,
        at(ctx, 3).term,
        at(ctx, 3).gloss,
      ),
      say(ctx, 5, "Close the conversation.", ctx.pack.goodbye, "Say goodbye", ctx.pack.goodbye, ""),
    )
  } else if (ctx.band === "Intermediate") {
    turns.push(
      say(
        ctx,
        3,
        `Give a reason using “${ctx.pack.because}”.`,
        `${line(ctx, "want", 2)}, ${ctx.pack.because} ${line(ctx, "like", 2)}.`,
        `${meaningOf(ctx, "want", 2)}, because ${meaningOf(ctx, "like", 2).toLowerCase()}.`,
        at(ctx, 2).term,
        at(ctx, 2).gloss,
      ),
      say(
        ctx,
        4,
        "The first choice is gone. Name a different one.",
        `${line(ctx, "problem", 0)}. ${line(ctx, "want", 3)}.`,
        `${meaningOf(ctx, "problem", 0)}. ${meaningOf(ctx, "want", 3)}.`,
        at(ctx, 3).term,
        at(ctx, 3).gloss,
      ),
      say(ctx, 5, "Ask a question back, then say goodbye.", `${line(ctx, "questionLike", 4)} ${ctx.pack.goodbye}.`, `${meaningOf(ctx, "questionLike", 4)} Goodbye.`, at(ctx, 4).term, at(ctx, 4).gloss),
    )
  } else {
    turns.push(
      say(
        ctx,
        3,
        "Tell what happened yesterday, then give an opinion.",
        `${line(ctx, "yesterday", 2)}. ${line(ctx, "opinion", 3)}.`,
        `${meaningOf(ctx, "yesterday", 2)}. ${meaningOf(ctx, "opinion", 3)}.`,
        at(ctx, 2).term,
        at(ctx, 2).gloss,
      ),
      say(
        ctx,
        4,
        "Something goes wrong. Repair it, then choose something else.",
        `${ctx.pack.repair} ${line(ctx, "problem", 0)}. ${line(ctx, "want", 4)}.`,
        `Please repeat. ${meaningOf(ctx, "problem", 0)}. ${meaningOf(ctx, "want", 4)}.`,
        at(ctx, 4).term,
        at(ctx, 4).gloss,
      ),
      say(
        ctx,
        5,
        "Close with a detail, not only goodbye.",
        `${line(ctx, "have", 5)}. ${ctx.pack.thanks}. ${ctx.pack.goodbye}.`,
        `${meaningOf(ctx, "have", 5)}. Thank you. Goodbye.`,
        at(ctx, 5).term,
        at(ctx, 5).gloss,
      ),
    )
  }

  return turns
}

function say(
  ctx: Ctx,
  index: number,
  task: string,
  model: string,
  meaning: string,
  focus: string,
  gloss: string,
): SayTurn {
  return {
    scene: `Pip is ${ctx.partner}.`,
    task,
    model,
    meaning,
    bank: bankFor(ctx, model, index),
    focus,
    gloss,
  }
}

function lineForge(ctx: Ctx): Material {
  const lines = forgeLines(ctx)
  return {
    id: "line-forge",
    title: "Line Forge",
    hook: "Build the sentence with taps, then say it only if you want the bonus.",
    kind: "forge",
    mode: "Presentational",
    cs: ["Communication"],
    canDo: ctx.canDos.presentational,
    minutes: 6,
    spotlight: "private",
    playable: true,
    quick: false,
    xp: 35,
    whySafe: "The sentence exists as chips before anyone speaks. Saying it is a private bonus, not the price of admission.",
    steps: [
      "Students drag or tap chips into order. The English meaning stays visible.",
      "After a correct line, they may say it to Pip or tap “I said it quietly.” Both count.",
      `Pattern in play: ${ctx.grammar}.`,
    ],
    support: "Two extra chips, not ten. They can replay a line.",
    stretch: "After five lines, they write a sixth with a word that was not on the chips.",
    handout: [
      {
        kind: "list",
        title: "Lines to cut into strips",
        items: lines.map((entry) => `${entry.meaning}  →  ${entry.model}`),
      },
    ],
    play: { type: "forge", lines },
  }
}

function forgeLines(ctx: Ctx): ForgeLine[] {
  const specs: { key: "want" | "howMuch" | "like" | "where" | "have"; index: number }[] = [
    { key: "want", index: 0 },
    { key: "howMuch", index: 1 },
    { key: "like", index: 2 },
    { key: "where", index: 3 },
    { key: "have", index: 4 },
  ]
  return specs.map((spec) => {
    const model = ctx.pack.framed ? line(ctx, spec.key, spec.index) : `${line(ctx, spec.key, spec.index)} (${meaningOf(ctx, spec.key, spec.index)})`
    const answer = model.split(/\s+/).filter(Boolean)
    const distractors = [at(ctx, spec.index + 3).term, ctx.pack.no].flatMap((part) => part.split(/\s+/)).filter(Boolean)
    const chips = shuffle([...answer, ...distractors.slice(0, 2)], ctx.rng)
    return { meaning: meaningOf(ctx, spec.key, spec.index), chips, answer, model }
  })
}

function chorus(ctx: Ctx): Material {
  const lines = chorusLines(ctx)
  return {
    id: "chorus",
    title: "Chorus Countdown",
    hook: "The whole class says the line. Nobody takes a solo.",
    kind: "chorus",
    mode: "Interpersonal",
    cs: ["Communication"],
    canDo: ctx.canDos.interpersonal,
    minutes: 3,
    spotlight: "chorus",
    playable: true,
    quick: true,
    xp: 20,
    whySafe: "A freeze is invisible. The line still happens because everyone else is on it.",
    steps: [
      "Project the countdown. You say the call. On zero, the class answers together.",
      "Keep your eyes on the screen, not on a single student.",
      "Run the list twice if the first pass is mush. Still no solos.",
    ],
    support: "Point at the response while they say it. Leave it up.",
    stretch: "Second pass: they add one word of their own after the shared line, still in chorus.",
    handout: [
      {
        kind: "table",
        title: "Call and response",
        columns: ["You say", "Class says"],
        rows: lines.map((entry) => [entry.call, entry.response]),
      },
    ],
    play: { type: "chorus", lines },
  }
}

function chorusLines(ctx: Ctx): ChorusLine[] {
  return [
    { call: "Greet the room.", response: ctx.pack.hello, meaning: "Hello" },
    { call: `Ask if they like ${labelOf(at(ctx, 0))}.`, response: line(ctx, "questionLike", 0), meaning: meaningOf(ctx, "questionLike", 0) },
    { call: "Answer for yourselves.", response: line(ctx, "like", 0), meaning: meaningOf(ctx, "like", 0) },
    { call: `Ask the price of ${labelOf(at(ctx, 1))}.`, response: line(ctx, "howMuch", 1), meaning: meaningOf(ctx, "howMuch", 1) },
    { call: "The price is too high. React together.", response: ctx.pack.tooMuch, meaning: "That's too much" },
    { call: "Close it.", response: `${ctx.pack.thanks}. ${ctx.pack.goodbye}.`, meaning: "Thank you. Goodbye." },
  ]
}

function maskQuest(ctx: Ctx): Material {
  const masks = masksFor(ctx)
  return {
    id: "mask-quest",
    title: "Mask Quest",
    hook: "Three characters. The student is none of them.",
    kind: "mask",
    mode: "Interpersonal",
    cs: ["Communication", "Cultures"],
    canDo: ctx.canDos.interpersonal,
    minutes: 6,
    spotlight: "mask",
    playable: true,
    quick: false,
    xp: 40,
    whySafe: "If the line is awkward, it belongs to Sol, Nilo, or Remy. That distance is the point.",
    steps: [
      "Students pick one mask and play only that scene. They can switch after the stamp.",
      "Remind them: a silly choice is the character's choice.",
      `Culture note you can drop in one sentence: ${ctx.culture}`,
    ],
    support: "Word bank on. Model line visible.",
    stretch: "They play a second mask and must not reuse the same item.",
    handout: [
      {
        kind: "list",
        title: "Mask cards",
        items: masks.flatMap((mask) => [`${mask.name} — ${mask.role}`, ...mask.turns.map((turn) => `   ${turn.task} → ${turn.model}`)]),
      },
    ],
    play: {
      type: "mask",
      intro: "Pick who is talking. You are not on stage. The character is.",
      bankOn: ctx.band === "Novice",
      masks,
    },
  }
}

function masksFor(ctx: Ctx): MaskPlay[] {
  return [
    {
      name: "Sol",
      role: `Already knows what they want around ${ctx.topic}.`,
      turns: [
        say(ctx, 0, "Greet, then name the thing you came for.", `${ctx.pack.hello}. ${line(ctx, "want", 0)}.`, `Hello. ${meaningOf(ctx, "want", 0)}.`, at(ctx, 0).term, at(ctx, 0).gloss),
        say(ctx, 1, "Ask the price like someone who has done this before.", line(ctx, "howMuch", 0), meaningOf(ctx, "howMuch", 0), at(ctx, 0).term, at(ctx, 0).gloss),
        say(ctx, 2, "Thank them and go.", `${ctx.pack.thanks}. ${ctx.pack.goodbye}.`, "Thank you. Goodbye.", ctx.pack.thanks, ""),
      ],
    },
    {
      name: "Nilo",
      role: `New to ${ctx.topic}, and has to ask.`,
      turns: [
        say(ctx, 3, "Greet, a little unsure.", ctx.pack.hello, "Say hello", ctx.pack.hello, ""),
        say(ctx, 4, "Ask where something is.", line(ctx, "where", 2), meaningOf(ctx, "where", 2), at(ctx, 2).term, at(ctx, 2).gloss),
        say(ctx, 5, "Ask them to repeat.", ctx.pack.repair, "Could you repeat that?", ctx.pack.repair, ""),
      ],
    },
    {
      name: "Remy",
      role: "Hits a snag and repairs it without making a speech.",
      turns: [
        say(ctx, 1, "Ask for something.", line(ctx, "want", 1), meaningOf(ctx, "want", 1), at(ctx, 1).term, at(ctx, 1).gloss),
        say(ctx, 4, "It is not available. Say so, then switch.", `${line(ctx, "problem", 1)}. ${line(ctx, "want", 4)}.`, `${meaningOf(ctx, "problem", 1)}. ${meaningOf(ctx, "want", 4)}.`, at(ctx, 4).term, at(ctx, 4).gloss),
        say(ctx, 3, "React to the price.", ctx.pack.tooMuch, "That's too much", ctx.pack.tooMuch, ""),
      ],
    },
  ]
}

function whisperCards(ctx: Ctx): Material {
  const cards = whisperDeck(ctx)
  return {
    id: "whisper-cards",
    title: "Whisper Cards",
    hook: "One partner, one card, voices under the room noise.",
    kind: "cards",
    mode: "Interpersonal",
    cs: ["Communication"],
    canDo: ctx.canDos.interpersonal,
    minutes: 6,
    spotlight: "pair",
    playable: true,
    quick: false,
    xp: 25,
    whySafe: "Every pair talks at once. There is no audience, and the card holds the language if memory slips.",
    steps: [
      "Pairs sit knee to knee. One student sees the front, whispers the back, then they flip.",
      "The solo arcade version lets a student practice the flip before the pair.",
      "Collect nothing. The stamp is the exit.",
    ],
    support: "The back of the card is the full line, not a blank.",
    stretch: "Second round they hide the back and whisper from memory. Partner may flash the card.",
    handout: [
      {
        kind: "table",
        title: "Print and cut",
        columns: ["Show this", "Whisper this"],
        rows: cards.map((card) => [card.front, card.back]),
      },
    ],
    play: { type: "cards", cards },
  }
}

function whisperDeck(ctx: Ctx): WhisperCard[] {
  const cards: WhisperCard[] = [
    { front: `Whisper a greeting to ${ctx.partner}.`, back: ctx.pack.hello, meaning: "Hello" },
    { front: `Whisper that you want ${labelOf(at(ctx, 0))}.`, back: line(ctx, "want", 0), meaning: meaningOf(ctx, "want", 0) },
    { front: `Ask the price of ${labelOf(at(ctx, 1))}.`, back: line(ctx, "howMuch", 1), meaning: meaningOf(ctx, "howMuch", 1) },
    { front: `Say you like ${labelOf(at(ctx, 2))}.`, back: line(ctx, "like", 2), meaning: meaningOf(ctx, "like", 2) },
    { front: `Ask where ${labelOf(at(ctx, 3))} is.`, back: line(ctx, "where", 3), meaning: meaningOf(ctx, "where", 3) },
    { front: "The price is too high. React.", back: ctx.pack.tooMuch, meaning: "That's too much" },
    { front: "You didn't hear. Repair it.", back: ctx.pack.repair, meaning: "Could you repeat that?" },
    { front: "Close politely.", back: `${ctx.pack.thanks}. ${ctx.pack.goodbye}.`, meaning: "Thank you. Goodbye." },
  ]
  return cards
}

function exitTicket(ctx: Ctx): Material {
  const questions = ticketQuestions(ctx)
  return {
    id: "exit-ticket",
    title: "Exit Ticket Blitz",
    hook: "Three checks and one honest pulse. The pulse is not a grade.",
    kind: "ticket",
    mode: "Interpretive",
    cs: ["Communication"],
    canDo: ctx.canDos.interpretive,
    minutes: 4,
    spotlight: "quiet",
    playable: true,
    quick: false,
    xp: 20,
    whySafe: "The last item asks how ready they feel. Every answer earns the stamp. You get a signal without a show of hands.",
    steps: [
      "Run it in the last four minutes. Devices down after the stamp.",
      "Look at the pulse, not a rank order of students.",
      "Tomorrow's opener is the word the “not yet” students would have needed. Ask the class for that word on paper.",
    ],
    support: "Read the prompts aloud once. They still tap privately.",
    stretch: "Students who mark “I can add a detail” write that detail on the back of a card for the jar.",
    handout: [
      {
        kind: "list",
        title: "If you need it on paper",
        items: questions.map((question, index) =>
          question.kind === "choice"
            ? `${index + 1}. ${question.prompt}  Key: ${question.answer}`
            : `${index + 1}. ${question.prompt} (not graded)`,
        ),
      },
    ],
    play: { type: "ticket", questions },
  }
}

function ticketQuestions(ctx: Ctx): TicketQuestion[] {
  const item = at(ctx, 0)
  const other = at(ctx, 1)
  return [
    {
      kind: "choice",
      prompt: item.gloss ? `Which word matches “${item.gloss}”?` : `Find the line for ${item.term}.`,
      options: shuffle([item.term, other.term, ctx.pack.hello, ctx.pack.goodbye], ctx.rng),
      answer: item.term,
    },
    {
      kind: "choice",
      prompt: "Which line asks a price?",
      options: shuffle([line(ctx, "howMuch", 1), line(ctx, "like", 2), ctx.pack.thanks, ctx.pack.yes], ctx.rng),
      answer: line(ctx, "howMuch", 1),
    },
    {
      kind: "choice",
      prompt: "Which line gets you out of a muddle when you did not hear?",
      options: shuffle([ctx.pack.repair, line(ctx, "have", 2), ctx.pack.no, ctx.pack.hello], ctx.rng),
      answer: ctx.pack.repair,
    },
    {
      kind: "pulse",
      prompt: `Could you say one line about ${ctx.topic} to Pip right now?`,
      options: [
        "Not yet",
        "With the word bank",
        "Yes, a sentence",
        "Yes, and I can add a detail",
      ],
    },
  ]
}

import type { LessonInput, Material, VocabTerm } from "./actfl";
import { resolveVocab } from "./banks";

let n = 0;
const uid = (p: string) => `${p}-${Date.now()}-${n++}`;

function fmtList(terms: VocabTerm[]): string[] {
  return terms.map(
    (t) => `• ${t.term}${t.gloss ? ` — ${t.gloss}` : ""}${t.example ? `  (“${t.example}”)` : ""}`
  );
}

export function generateMaterials(input: LessonInput): Material[] {
  const terms = resolveVocab(input.language, input.theme, input.vocabRaw);
  const core = terms.slice(0, 10);
  const T = input.theme;
  const L = input.language;
  const lvl = input.level;
  const out: Material[] = [];

  const push = (m: Omit<Material, "id">) => out.push({ ...m, id: uid("mat") });

  push({
    kind: "Flashcards",
    title: `Picture flashcards — ${T}`,
    mode: "Interpretive",
    icon: "🃏",
    minutes: 10,
    group: "Whole class / stations",
    tags: [`ACTFL ${lvl}`, "Interpretive listening/reading", "Novice-friendly visuals"],
    summary: `Print-and-cut cards for all ${core.length} target chunks. Image side + phrase side, color-coded by word type.`,
    sections: [
      { heading: "How to run it (shy-safe)", items: ["Hold up image → class choruses the chunk together (no solo spotlight).", "Flip for gloss. Thumbs-up/down check: “¿entiendes?”", "Pairs quiz each other — listener points, speaker whispers."] },
      { heading: "Card set", items: fmtList(core) },
    ],
  });

  push({
    kind: "Quiz",
    title: "5-minute interpretive quiz",
    mode: "Interpretive",
    icon: "✅",
    minutes: 5,
    group: "Individual",
    tags: [`ACTFL ${lvl}`, "Can-Do check", "Exit data"],
    summary: "10 auto-made questions: image-match, true/false, and one short scenario.",
    sections: [
      { heading: "Questions", items: core.slice(0, 8).map((t, i) => `${i + 1}. Match “${t.term}” → meaning?  (a) ${t.gloss || "___"} (b) not this (c) not this — circle + draw a quick icon.`) },
      { heading: "Scenario", items: [`Read: a friend texts about ${T.toLowerCase()}. Reply with 2 chunks from today's list.`, `Can-Do: “I can recognize ${core.length} phrases about ${T.toLowerCase()}.” — circle: Yes / Almost / Not yet.`] },
    ],
  });

  push({
    kind: "Game",
    title: "Vocab Sprint relay (no-mic friendly)",
    mode: "Mixed",
    icon: "⚡",
    minutes: 12,
    group: "Teams of 3–4",
    tags: ["Gamified", "Zero speaking pressure", "Movement"],
    summary: "Relay race: run, grab the card that matches the projected image/English gloss, slap it on the team board.",
    sections: [
      { heading: "Setup (2 min)", items: ["Print one card set per team (cut up). Project glosses one at a time.", "Each round one runner; teammates may whisper-hint (no shouting)."] },
      { heading: "Rounds", items: ["Round 1 — image → target phrase (recognition).", "Round 2 — English gloss → target phrase (recall).", "Final — teacher reads example sentence, team holds up the key chunk."] },
    ],
  });

  push({
    kind: "Game",
    title: "Bingo + “Find someone who” board",
    mode: "Interpersonal",
    icon: "🎯",
    minutes: 15,
    group: "Mingle",
    tags: ["Gamified", "Interpersonal warm-up", `ACTFL ${lvl}`],
    summary: "9-square bingo using today's chunks. Students circulate asking yes/no + either-or questions — signatures, not speeches.",
    sections: [
      { heading: "Board prompts", items: core.slice(0, 9).map((t) => `“¿Te gusta / tienes / quieres ${t.term}?” — if YES, they sign.`) },
      { heading: "Shy-safe rules", items: ["Script on the board; students read, never invent under pressure.", "Pass card allowed: skip and come back — no penalty.", "First bingo = team points, not solo performance."] },
    ],
  });

  push({
    kind: "Speaking",
    title: "Whisper-first role plays (embarrassment-proof)",
    mode: "Interpersonal",
    icon: "🎭",
    minutes: 15,
    group: "Pairs, masked",
    tags: ["Interpersonal", "Low-anxiety speaking", "Avatar option"],
    summary: "3 café/street scripts at your level. Students rehearse masked (avatar names), then perform for ONE other pair — never the whole class cold.",
    sections: [
      { heading: "Script A — Order / ask", items: [`A: greeting + “${core[0]?.term ?? "hello"}”.`, `B: responds + asks a follow-up (“¿y tú?” / “¿algo más?”).`, "Swap roles. Add one adjective (delicious / big / late)."] },
      { heading: "Script B — Problem", items: ["A: something is wrong (lost / late / missing).", "B: offers two choices (“¿esto o esto?”). A picks one.", "End with thanks + goodbye chunk."] },
      { heading: "Safety switches", items: ["🎭 Avatar names (e.g. “Agent Taco”) — no real names on the board.", "🤫 Whisper round first; voice round only when ready.", "📱 No-mic path: type the line in the Arcade instead of saying it."] },
    ],
  });

  push({
    kind: "Speaking",
    title: "Info-gap: split menus / split maps",
    mode: "Interpersonal",
    icon: "🧩",
    minutes: 15,
    group: "Pairs A/B",
    tags: ["Interpersonal", "Negotiation of meaning", "Info gap"],
    summary: "Partner A has half the info, B has the other half. They must ask to complete the task — the classic ACTFL interpersonal task.",
    sections: [
      { heading: "Student A (has prices, missing items)", items: core.slice(0, 5).map((t) => `Ask B: “¿Cuánto / dónde / qué … ${t.term}?” Write what B says.`) },
      { heading: "Student B (has items, missing prices)", items: core.slice(5, 10).map((t) => `Ask A: “¿Tienes … ${t.term}?” Agree on a final plan together.`) },
    ],
  });

  push({
    kind: "Listening",
    title: "Listen-and-do dictation grid",
    mode: "Interpretive",
    icon: "👂",
    minutes: 10,
    group: "Individual / pairs",
    tags: ["Interpretive listening", "TPR", `ACTFL ${lvl}`],
    summary: "Teacher (or Arcade TTS) reads 8 mini-lines; students number, sketch, or move cards — no writing full sentences.",
    sections: [
      { heading: "Script (read twice, slow → natural)", items: core.slice(0, 8).map((t, i) => `${i + 1}. “…${t.term}…” ${t.example ? `(${t.example})` : ""}`) },
      { heading: "Student response", items: ["Number the matching picture 1–8.", "Draw a ⭐ next to the one you'd pick for yourself.", "Compare with a partner — whisper, don't shout out."] },
    ],
  });

  push({
    kind: "Reading",
    title: "Tiered mini-reading + true/false",
    mode: "Interpretive",
    icon: "📖",
    minutes: 12,
    group: "Individual",
    tags: ["Interpretive reading", "Tiered", "Culture"],
    summary: `A 90-word ${L} text on ${T} written at ${lvl}, with cognates bolded and a 6-question check.`,
    sections: [
      {
        heading: "Text (adapt freely)",
        items: [
          `Hola, me llamo Alex. ${core[0]?.example ?? ""} ${core[1]?.example ?? ""} ${core[2]?.example ?? ""} Me gusta mucho ${T.toLowerCase()} porque es divertido y fácil. ${core[3]?.example ?? ""} ¿Y tú? ¿Qué prefieres?`,
          "Teacher tip: bold cognates, add 3假 picture glosses in the margin (not translations).",
        ],
      },
      { heading: "Check", items: ["4× true/false (circle V/F).", "1× “which chunk means…?” matching.", "1× draw: illustrate the last line."] },
    ],
  });

  push({
    kind: "Writing",
    title: "Sentence builders + substitution ladders",
    mode: "Presentational",
    icon: "🧱",
    minutes: 12,
    group: "Pairs",
    tags: ["Presentational", "Scaffolding", "Grammar-in-context"],
    summary: "Grid that lets every student build 20+ correct sentences by swapping one brick at a time.",
    sections: [
      { heading: "Builder grid", items: ["WHO: yo / mi amigo / nosotros", `WANT/NEED: ${core[4]?.term ?? "quiero"} / necesito / prefiero`, `WHAT: ${core.slice(0, 5).map((t) => t.term).join(" / ")}`, "DETAIL: hoy / mañana / con amigos / por favor"] },
      { heading: "Ladder", items: ["Write 4 sentences, changing ONE brick each time.", "Read your favorite to your partner in a whisper voice.", "Star your best — that's your exit ticket line."] },
    ],
  });

  push({
    kind: "Culture",
    title: "Culture capsule (5-minute story)",
    mode: "Mixed",
    icon: "🌍",
    minutes: 5,
    group: "Whole class",
    tags: ["Cultures (5 Cs)", "Comparisons", "Engagement hook"],
    summary: `A 2-minute story connecting ${T.toLowerCase()} to daily life in a ${L}-speaking place, plus a compare question.`,
    sections: [
      { heading: "Story beat", items: [`In ${L}-speaking places, ${T.toLowerCase()} works a little differently — mealtimes, greetings, or street life have their own rhythm.`, "Show 2 photos. Ask: what do you notice first? (English OK for the noticing, target language for the chunks.)"] },
      { heading: "Compare", items: ["“In my life ___ but there ___.” (one sentence, either language + one target chunk).", "Vote: would you prefer their way or ours? Hands, not speeches."] },
    ],
  });

  push({
    kind: "Game",
    title: "Charades / Pictionary card deck",
    mode: "Mixed",
    icon: "🎨",
    minutes: 10,
    group: "Teams",
    tags: ["Gamified", "Movement", "No-mic friendly"],
    summary: "Act or draw the chunk while the team guesses — the beloved no-speaking-pressure classic.",
    sections: [
      { heading: "Deck", items: fmtList(core.slice(0, 10)) },
      { heading: "Rules", items: ["Actor silent; team shouts guesses (target language = double points).", "30 seconds per card. Skip = free, no shame.", "Teacher whispers the chunk to shy actors first."] },
    ],
  });

  push({
    kind: "Worksheet",
    title: "Word-search + crossword pair",
    mode: "Interpretive",
    icon: "🔤",
    minutes: 10,
    group: "Early finishers / homework",
    tags: ["Spelling", "Homework-ready"],
    summary: "Low-prep puzzles generated from the exact word list — great for subs and fast finishers.",
    sections: [
      { heading: "Word bank", items: core.map((t) => t.term) },
      { heading: "Make it in 60 seconds", items: ["Paste the bank into any free word-search maker (e.g. education.com/worksheet-generator).", "Crossword clues = the English glosses above.", "Answer key = this card. Done."] },
    ],
  });

  push({
    kind: "Game",
    title: "Story dice (presentational game)",
    mode: "Presentational",
    icon: "🎲",
    minutes: 12,
    group: "Small groups",
    tags: ["Gamified", "Presentational", "Creativity"],
    summary: "Roll for WHO + WHERE + PROBLEM, then tell a 3-sentence story using today's chunks. Silliest coherent story wins.",
    sections: [
      { heading: "Dice faces", items: [`WHO: yo / mi familia / ${core[2]?.term ?? "friends"} / el/la profe / un turista / mi gato`, `WHERE: aquí / en ${T.toLowerCase()} / mañana / ayer / en clase / en secreto`, `TWIST: ¡oh no! + ${core[5]?.term ?? "problema"} / ¡qué bien! / de repente…`] },
      { heading: "Frame", items: ["Sentence 1: who + where.", "Sentence 2: problem (use a chunk).", "Sentence 3: solution + feeling."] },
    ],
  });

  push({
    kind: "Assessment",
    title: "Can-Do exit ticket + self-check",
    mode: "Mixed",
    icon: "🚪",
    minutes: 5,
    group: "Individual",
    tags: ["Can-Do statements", "Formative", `ACTFL ${lvl}`],
    summary: "Half-sheet aligned to today's Can-Dos. Students circle, write one line, and set tomorrow's goal.",
    sections: [
      { heading: "I can… (circle)", items: [`Name ${Math.min(8, core.length)} phrases about ${T.toLowerCase()}: YES / ALMOST / NOT YET`, "Understand my partner's question and respond: YES / ALMOST / NOT YET", "Say one thing I liked + one thing I want to practice."] },
      { heading: "One line", items: [`Write ONE ${L} sentence using a chunk from today.`, "Goal for next class (English OK): ___"] },
    ],
  });

  push({
    kind: "Homework",
    title: "Choice-board homework (challenge by choice)",
    mode: "Mixed",
    icon: "📋",
    minutes: 20,
    group: "At home",
    tags: ["Differentiation", "Communities (5 Cs)"],
    summary: "3×3 grid: pick any 2 squares. Every option reuses today's chunks in a real-world micro-task.",
    sections: [
      { heading: "Board", items: ["📸 Photo-label 5 things at home with target chunks.", "🎙️ 30-sec whisper voice memo describing your dinner/route/day.", "💬 Teach one chunk to a family member; report their pronunciation.", "🗺️ Screenshot a map of a target-language city; label 3 places.", "🍳 Find a recipe/video in the language; write the 3 key words.", "🎵 Learn the chorus of one song; copy 2 lines you understood.", "✏️ Write a 4-line comic using 3 chunks.", "🏪 Spot a cognate “in the wild” (package/menu/sign); bring it in.", "⭐ Free square: quiz yourself in the Arcade, screenshot XP."] },
    ],
  });

  push({
    kind: "Support",
    title: "Novice survival scaffolds",
    mode: "Mixed",
    icon: "🛟",
    minutes: 0,
    group: "Accommodations",
    tags: ["Differentiation", "Heritage learners → extensions"],
    summary: "Sentence starters, choice frames, and extensions so the same lesson works from Novice Low to heritage speakers.",
    sections: [
      { heading: "Sentence starters (post on board)", items: ["“Quiero / necesito / prefiero ___ porque ___.”", "“¿Dónde / cuánto / qué ___?”", "“Me gusta ___ pero no me gusta ___.”"] },
      { heading: "Extensions (fast finishers / heritage)", items: [`Add time frame: “ayer… / mañana…” to every line about ${T.toLowerCase()}.`, "Add a polite softener + reason (por favor / porque…).", "Rewrite the role play with a complication (wrong order, closed road)."] },
    ],
  });

  push({
    kind: "Plan",
    title: "50-minute lesson flow (copy-paste agenda)",
    mode: "Mixed",
    icon: "🗓️",
    minutes: 50,
    group: "Teacher script",
    tags: ["Lesson plan", "5 Cs", "Three modes"],
    summary: "A timed agenda weaving every material above into one period, hitting all three communication modes.",
    sections: [
      {
        heading: "Agenda",
        items: [
          "0:00–0:05 culture capsule hook + Can-Do reveal (“Today I can…”).",
          "0:05–0:12 flashcards + listen-and-do (Interpretive).",
          "0:12–0:24 whisper role plays + info-gap (Interpersonal, masked).",
          "0:24–0:34 sprint relay or bingo (game break, movement).",
          "0:34–0:44 sentence builders + story dice (Presentational).",
          "0:44–0:50 exit ticket + XP in the Arcade.",
        ],
      },
    ],
  });

  if (input.objectives.trim()) {
    push({
      kind: "Alignment",
      title: "ACTFL alignment note for your objective",
      mode: "Mixed",
      icon: "📎",
      minutes: 0,
      group: "Planning / admin",
      tags: ["World-Readiness Standards", "Admin-ready"],
      summary: `Maps your objective (“${input.objectives.slice(0, 120)}”) to modes, Cs, and Can-Dos for observations and lesson plans.`,
      sections: [
        { heading: "Mapping", items: [`Primary mode: Interpersonal (negotiation about ${T.toLowerCase()}); secondary: Interpretive + Presentational.`, "5 Cs hit: Communication + Cultures + Comparisons; Communities via choice-board homework.", `Evidence: quiz + exit ticket + Arcade XP log (screenshots accepted).`] },
      ],
    });
  }

  return out;
}

# LinguaPlay Studio — ACTFL-connected lesson generator + shy-safe games

A teacher tool + student arcade for world-language classes, aligned to **ACTFL Proficiency Guidelines**, the **World-Readiness Standards (5 Cs)**, and **Can-Do Statements**.

**The problem it solves:** teachers need dozens of supplemental materials from one lesson fast — and kids say speaking is embarrassing, so they'd rather play games.

## What it does

- **👩‍🏫 Teacher Studio** — pick language (ES/FR/DE/IT/ZH/JA), ACTFL level, theme, paste your vocab + objective → instantly generates **18 supplemental materials**: flashcards, quiz, sprint relay, bingo mingle, whisper-first role plays, info-gap, dictation grid, tiered reading, sentence builders, culture capsule, charades deck, puzzles, story dice, exit ticket, choice-board homework, scaffolds, a 50-min agenda, and an ACTFL alignment note.
- **📦 Material Vault** — search/filter by communication mode, expand any card, copy to slides/docs/LMS, or print.
- **🕹️ Student Arcade** — 5 playable games with XP, levels, avatar codenames + incognito mode:
  - ⚡ Vocab Sprint (30-sec match frenzy)
  - 👂 Listening Quest (text-to-speech in the target language)
  - 🧱 Sentence Builder (word-order puzzles)
  - 🎭 Incognito Voice (shy-safe speaking: listen → whisper → claim XP; mic optional, whisper/type paths earn full credit)
  - 🎯 Bingo Caller (projectable classroom caller)
- **📘 ACTFL Guide** — three modes, proficiency ladder, 5 Cs, and the "embarrassing speaking" playbook (masks, whispers, scripts, no-mic paths).

## Run it

```bash
npm install
npm run dev   # → http://localhost:43123
```

No API keys, no database — vocab banks + generator run locally; XP/avatars persist in `localStorage`. Speech uses the browser's built-in Web Speech API (TTS everywhere, mic where supported with graceful fallback).

## Class flow

1. Teacher spends 60 seconds in the Studio.
2. Prints/copies 2–3 Vault cards + projects the Bingo Caller.
3. Students play the Arcade (incognito on) for warm-up/exit — XP screenshots as evidence.
4. Exit ticket Can-Dos feed tomorrow's plan.

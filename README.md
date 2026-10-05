# LingoQuest

An ACTFL-aligned companion for world-language teachers and their students.

- **Teacher studio** — enter one lesson (language, ACTFL proficiency target, theme, vocabulary, model sentences, structures, culture note) and get **50+ supplemental materials** generated instantly: warm-ups, interpretive tasks, interpersonal activities, presentational tasks, classroom games, formative assessments, an IPA blueprint, a speaking rubric, 5 Cs culture tasks, and homework. Every material is filtered to the proficiency level, pre-filled with your vocabulary, tagged with its mode of communication, and linked to an NCSSFL-ACTFL Can-Do statement.
- **Student arcade** — a gamified, private way to practise speaking. Students talk to their own device, not the class. Speech recognition scores them, every attempt earns XP, and ranks are named after the ACTFL sublevels.

## What is ACTFL-aligned here

| ACTFL concept | Where it appears |
| --- | --- |
| Proficiency Guidelines (Novice Low → Advanced High) | Lesson level picker, material filtering, rubric target column, arcade rank names |
| Three modes of communication | Every material is tagged Interpersonal / Interpretive / Presentational; mode balance chart per lesson |
| NCSSFL-ACTFL Can-Do Statements | Suggested lesson goals per sublevel, Can-Do alignment on every material, student self-check in the arcade |
| World-Readiness Standards (5 Cs) | Dedicated Cultures / Connections / Comparisons / Communities materials |
| Integrated Performance Assessment | IPA blueprint generated per lesson |
| Performance descriptors | Printable speaking rubric |

## Games

| Game | Skill | Why it lowers speaking anxiety |
| --- | --- | --- |
| **Speak Quest** | Speaking | Students repeat words and sentences, then answer open prompts, to their own device. Speech recognition (Web Speech API) scores privately; browsers without it fall back to a timed self-check. |
| **Vocab Blitz** | Reading / recognition | 60-second multiple-choice sprint with combo multipliers. |
| **Sentence Scramble** | Reading / writing | Rebuild model sentences from shuffled chunks; optional read-aloud bonus. |

XP, streaks, badges, best scores, and Can-Do self-checks are stored in the browser's `localStorage`. There are no accounts and no server-side storage.

## Sharing lessons with students

Lessons live on the teacher's device. "Copy student link" encodes the whole lesson into a URL (`/play/import#…`); opening it on any device saves the lesson locally and launches the arcade.

## Running locally

```bash
npm install
npm run dev
```

Open <http://127.0.0.1:4871>. A demo lesson (Italian, Novice Mid, food & café culture) is built in.

Other scripts:

```bash
npm run lint   # ESLint
npm run build  # production build
npm start      # serve the production build
```

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui, lucide-react, sonner. Speech features use the browser's Web Speech API (`SpeechRecognition` for scoring, `speechSynthesis` for models); Chrome and Edge give the best results.

## Project layout

```
src/
  app/
    page.tsx                 landing
    teacher/                 lesson list, new lesson, lesson materials, edit
    play/                    arcade home, lesson hub, three games, link import
  components/
    lesson-form.tsx          teacher lesson builder
    material-card.tsx        generated activity card + detail dialog
    rubric-table.tsx         ACTFL speaking rubric
    arcade/                  games, progress panel, rewards
    ui/                      shadcn/ui primitives
  lib/
    actfl.ts                 levels, modes, Can-Do statements, languages, rubric
    generator.ts             material templates and the generator
    gamification.ts          XP, ranks, badges, streaks
    speech.ts                Web Speech helpers and scoring
    storage.ts               localStorage persistence and share links
    demo-lesson.ts           built-in sample lesson
```

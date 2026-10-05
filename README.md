# CanDo Arcade

Teachers drop in a lesson they already have. CanDo Arcade aligns it to an ACTFL-style target — proficiency band, the three modes of communication, and can-do statements — and deals out dozens of supplements. The games are built for students who would rather play than speak in front of the class: private talk with a mascot, character masks, pair whispers, and whole-class chorus.

This is an independent planning tool. It is not affiliated with or endorsed by ACTFL.

## Run it

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

Lessons and arcade progress stay in this browser. Nothing is uploaded. The microphone is optional; typed lines count. Speech recognition works in browsers that provide it, usually Chrome.

## What a teacher can do

- Open a sample (Spanish market, French school week, Mandarin introductions) or type a topic, level, and word list.
- Read the three can-do statements and filter the deck by mode, by the 15-minute set, or by tasks that keep speaking off the stage.
- Play any game as a student would, print the paper tasks, or copy a plan into a lesson document.

## Check the generator

```bash
npx tsx scripts/selfcheck.ts
```

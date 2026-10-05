"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CAN_DO_BANK,
  FIVE_CS,
  LANGUAGES,
  LEVELS,
  THEMES,
  levelExpectations,
  type CommMode,
  type LessonInput,
  type Material,
  type ProficiencyLevel,
} from "@/lib/actfl";
import { generateMaterials } from "@/lib/generator";
import { getBank, parseTeacherVocab } from "@/lib/banks";

// ---------- helpers ----------
function speak(text: string, langCode: string) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = langCode;
    u.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {}
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const AVATARS = ["🦊", "🐼", "🦄", "🐸", "🐯", "🤖", "🐙", "🦉"];
const CODENAMES = ["Agent Taco", "Captain Nube", "Shadow Pan", "Mango Spy", "Echo Lobo", "Pixel Salsa", "Ninja Libro", "Comet Queso"];

type Tab = "studio" | "vault" | "arcade" | "guide";

export default function Home() {
  const [tab, setTab] = useState<Tab>("studio");
  const [lesson, setLesson] = useState<LessonInput>({
    language: "Spanish",
    level: "Novice Mid",
    theme: "Food & Restaurants",
    title: "En el restaurante",
    vocabRaw: "",
    objectives: "Students can order food and handle the check politely.",
  });

  const materials = useMemo(() => generateMaterials(lesson), [lesson]);
  const vocab = useMemo(
    () => (parseTeacherVocab(lesson.vocabRaw).length >= 4
      ? parseTeacherVocab(lesson.vocabRaw).map((t) => ({ ...t, gloss: t.gloss || "—", example: t.example || "" }))
      : getBank(lesson.language, lesson.theme)),
    [lesson]
  );
  const langCode = LANGUAGES.find((l) => l.value === lesson.language)?.code ?? "es-ES";

  // vault filters
  const [query, setQuery] = useState("");
  const [modeFilter, setModeFilter] = useState<"All" | CommMode | "Mixed">("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = materials.filter((m) => {
    const q = query.toLowerCase();
    const hit = !q || (m.title + m.summary + m.kind).toLowerCase().includes(q);
    return hit && (modeFilter === "All" || m.mode === modeFilter);
  });

  // gamification
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [codename, setCodename] = useState(CODENAMES[0]);
  const [incognito, setIncognito] = useState(true);

  useEffect(() => {
    try {
      setXp(Number(localStorage.getItem("lp-xp") ?? 0));
      setAvatar(localStorage.getItem("lp-avatar") ?? AVATARS[0]);
      setCodename(localStorage.getItem("lp-code") ?? CODENAMES[0]);
    } catch {}
  }, []);
  const addXp = (pts: number) => {
    setXp((x) => {
      const nx = x + pts;
      try { localStorage.setItem("lp-xp", String(nx)); } catch {}
      return nx;
    });
  };
  const level = Math.floor(xp / 100) + 1;
  const progress = (xp % 100) / 100;
  const badges = [
    { at: 20, icon: "🌱", name: "First Words" },
    { at: 60, icon: "🎙️", name: "Brave Whisper" },
    { at: 150, icon: "⚡", name: "Sprint Star" },
    { at: 300, icon: "🌍", name: "Culture Explorer" },
    { at: 500, icon: "👑", name: "Lingua Legend" },
  ];

  const copyCard = async (m: Material) => {
    const text = `${m.title} [${m.mode} · ${m.minutes} min]\n${m.summary}\n\n${m.sections.map((s) => s.heading + "\n" + s.items.join("\n")).join("\n\n")}`;
    try { await navigator.clipboard.writeText(text); alert("Copied! Paste into slides, docs, or your LMS."); }
    catch { alert(text); }
  };

  return (
    <div className="min-h-screen bg-[#faf9ff] text-[#1a1033]">
      {/* HEADER */}
      <header className="no-print sticky top-0 z-30 border-b border-violet-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-2xl shadow">🎮</span>
            <div>
              <p className="text-lg font-black leading-none tracking-tight">LinguaPlay <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">Studio</span></p>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-500">ACTFL-connected · teacher + arcade</p>
            </div>
          </div>
          <nav className="mx-auto flex flex-wrap items-center gap-1 rounded-full bg-violet-50 p-1 text-sm font-bold">
            {([["studio", "👩‍🏫 Teacher Studio"], ["vault", `📦 Vault (${materials.length})`], ["arcade", "🕹️ Student Arcade"], ["guide", "📘 ACTFL Guide"]] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`rounded-full px-4 py-2 transition ${tab === t ? "bg-white shadow text-violet-700" : "text-violet-400 hover:text-violet-600"}`}>
                {label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-black text-amber-700">
            <span className="text-lg">{avatar}</span>
            <span>{incognito ? codename : "You"}</span>
            <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs text-white">Lv {level} · {xp} XP</span>
          </div>
        </div>
        {/* XP bar */}
        <div className="h-1.5 bg-violet-100"><div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 transition-all" style={{ width: `${progress * 100}%` }} /></div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6">
        {tab === "studio" && (
          <StudioTab lesson={lesson} setLesson={setLesson} materials={materials} vocabCount={vocab.length} goVault={() => setTab("vault")} goArcade={() => setTab("arcade")} />
        )}
        {tab === "vault" && (
          <VaultTab materials={materials} filtered={filtered} query={query} setQuery={setQuery}
            modeFilter={modeFilter} setModeFilter={setModeFilter} openId={openId} setOpenId={setOpenId} copyCard={copyCard} langLabel={lesson.language} />
        )}
        {tab === "arcade" && (
          <ArcadeTab vocab={vocab} langCode={langCode} langLabel={lesson.language} level={lesson.level}
            xp={xp} addXp={addXp} streak={streak} setStreak={setStreak}
            avatar={avatar} setAvatar={setAvatar} codename={codename} setCodename={setCodename}
            incognito={incognito} setIncognito={setIncognito} badges={badges} />
        )}
        {tab === "guide" && <GuideTab />}
      </main>

      <footer className="no-print border-t border-violet-100 bg-white px-4 py-6 text-center text-xs text-violet-400">
        Built for language teachers · Aligned to ACTFL Proficiency Guidelines, World-Readiness Standards (5 Cs) &amp; NCSSFL-ACTFL Can-Do Statements. Speaking games default to whisper / anonymous / no-mic paths so every kid can play.
      </footer>
    </div>
  );
}

// ================= STUDIO =================
function StudioTab({ lesson, setLesson, materials, vocabCount, goVault, goArcade }: {
  lesson: LessonInput; setLesson: (l: LessonInput) => void; materials: Material[]; vocabCount: number;
  goVault: () => void; goArcade: () => void;
}) {
  const canDos = CAN_DO_BANK[lesson.level] ?? [];
  const tips = levelExpectations(lesson.level);
  const modes = ["Interpretive", "Interpersonal", "Presentational", "Mixed"] as const;
  const counts = modes.map((m) => ({ m, c: materials.filter((x) => x.mode === m).length }));

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {/* FORM */}
      <section className="h-fit rounded-3xl border border-violet-100 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">⚡ 60-second lesson setup</h2>
        <p className="mb-4 text-sm text-slate-500">Type a few words — the Vault instantly builds <b>{materials.length} supplemental materials</b>.</p>

        <label className="mb-3 block">
          <span className="text-xs font-black uppercase tracking-wider text-violet-500">Lesson title</span>
          <input value={lesson.title} onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
            className="mt-1 w-full rounded-xl border border-violet-200 px-3 py-2 font-semibold outline-none focus:ring-2 focus:ring-violet-400" />
        </label>

        <div className="mb-3 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-violet-500">Language</span>
            <select value={lesson.language} onChange={(e) => setLesson({ ...lesson, language: e.target.value })}
              className="mt-1 w-full rounded-xl border border-violet-200 px-3 py-2 font-semibold">
              {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.flag} {l.value}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-violet-500">ACTFL level</span>
            <select value={lesson.level} onChange={(e) => setLesson({ ...lesson, level: e.target.value as ProficiencyLevel })}
              className="mt-1 w-full rounded-xl border border-violet-200 px-3 py-2 font-semibold">
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
        </div>

        <label className="mb-3 block">
          <span className="text-xs font-black uppercase tracking-wider text-violet-500">Theme</span>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {THEMES.map((t) => (
              <button key={t} onClick={() => setLesson({ ...lesson, theme: t })}
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${lesson.theme === t ? "bg-violet-600 text-white shadow" : "bg-violet-50 text-violet-600 hover:bg-violet-100"}`}>{t}</button>
            ))}
          </div>
        </label>

        <label className="mb-3 block">
          <span className="text-xs font-black uppercase tracking-wider text-violet-500">Your vocab (optional — one per line or “term — meaning”)</span>
          <textarea value={lesson.vocabRaw} onChange={(e) => setLesson({ ...lesson, vocabRaw: e.target.value })}
            rows={4} placeholder={"la cuenta — the bill\nquiero… — I want…\n…or just paste words, we handle the rest"}
            className="mt-1 w-full rounded-xl border border-violet-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400" />
        </label>

        <label className="mb-4 block">
          <span className="text-xs font-black uppercase tracking-wider text-violet-500">Learning objective</span>
          <input value={lesson.objectives} onChange={(e) => setLesson({ ...lesson, objectives: e.target.value })}
            className="mt-1 w-full rounded-xl border border-violet-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400" />
        </label>

        <div className="flex gap-2">
          <button onClick={goVault} className="flex-1 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 font-black text-white shadow-lg transition hover:scale-[1.02]">
            📦 Open {materials.length} materials →
          </button>
          <button onClick={goArcade} className="rounded-2xl border-2 border-violet-200 px-4 py-3 font-black text-violet-600 hover:bg-violet-50">🕹️</button>
        </div>
        <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">✅ Using built-in {lesson.language} bank: {vocabCount} terms for “{lesson.theme}”. Add your own vocab above to override.</p>
      </section>

      {/* PREVIEW */}
      <section className="space-y-5">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-600 p-6 text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200">{lesson.language} · {lesson.level} · {lesson.theme}</p>
          <h1 className="mt-1 text-3xl font-black">{lesson.title || "Untitled lesson"}</h1>
          <p className="mt-1 text-sm text-violet-100">“{lesson.objectives || "Can-do objective…"}”</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {counts.map(({ m, c }) => (
              <span key={m} className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">{m}: {c}</span>
            ))}
            <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-amber-950">⏱ ~{materials.reduce((a, m) => a + m.minutes, 0)} min of content</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-violet-100 bg-white p-5">
            <h3 className="font-black">🎯 Today&apos;s Can-Do statements</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {canDos.map((c) => <li key={c} className="flex gap-2 rounded-xl bg-violet-50 p-2.5 font-medium text-violet-900"><span>✅</span>{c}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl border border-violet-100 bg-white p-5">
            <h3 className="font-black">📏 What {lesson.level} means here</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              {tips.map((t) => <li key={t} className="flex gap-2"><span>💡</span>{t}</li>)}
            </ul>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-black">🔥 Fresh from the generator — first 6 of {materials.length}</h3>
            <button onClick={goVault} className="text-sm font-black text-violet-600 hover:underline">See all →</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {materials.slice(0, 6).map((m) => (
              <div key={m.id} className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-violet-700">{m.icon} {m.kind}</span>
                  <span className="text-slate-400">{m.mode} · {m.minutes}′</span>
                </div>
                <p className="mt-2 font-black leading-tight">{m.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{m.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border-2 border-dashed border-fuchsia-200 bg-fuchsia-50/60 p-5">
          <h3 className="font-black text-fuchsia-800">😳 “Speaking is embarrassing” — our answer</h3>
          <p className="mt-1 text-sm text-fuchsia-900/80">Every speaking task ships with <b>mask mode</b> (avatar codenames), <b>whisper-first rounds</b>, <b>scripted lines</b> (nothing invented under pressure), and a <b>no-mic path</b> (type instead of talk). Kids earn the same XP either way — bravery is rehearsed, never forced.</p>
          <button onClick={goArcade} className="mt-3 rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-black text-white hover:bg-fuchsia-700">Try the shy-safe Arcade →</button>
        </div>
      </section>
    </div>
  );
}

// ================= VAULT =================
function VaultTab({ materials, filtered, query, setQuery, modeFilter, setModeFilter, openId, setOpenId, copyCard, langLabel }: {
  materials: Material[]; filtered: Material[]; query: string; setQuery: (s: string) => void;
  modeFilter: string; setModeFilter: (s: "All" | CommMode | "Mixed") => void;
  openId: string | null; setOpenId: (s: string | null) => void;
  copyCard: (m: Material) => void; langLabel: string;
}) {
  return (
    <div>
      <div className="no-print mb-4 flex flex-wrap items-center gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="🔍 Search bingo, role play, quiz…"
          className="min-w-[220px] flex-1 rounded-2xl border border-violet-200 bg-white px-4 py-2.5 font-semibold outline-none focus:ring-2 focus:ring-violet-400" />
        {(["All", "Interpretive", "Interpersonal", "Presentational", "Mixed"] as const).map((m) => (
          <button key={m} onClick={() => setModeFilter(m)}
            className={`rounded-full px-4 py-2 text-sm font-bold ${modeFilter === m ? "bg-violet-600 text-white shadow" : "bg-white text-violet-500 border border-violet-200"}`}>{m}</button>
        ))}
        <button onClick={() => window.print()} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white">🖨️ Print all</button>
      </div>
      <p className="mb-3 text-sm font-semibold text-slate-500">Showing <b>{filtered.length}</b> of {materials.length} materials · {langLabel} · click any card to expand, copy, or print.</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((m) => {
          const open = openId === m.id;
          return (
            <article key={m.id} className="print-card flex flex-col rounded-3xl border border-violet-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="rounded-full bg-violet-100 px-2.5 py-1 text-violet-700">{m.icon} {m.kind}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500">{m.mode} · ⏱ {m.minutes}′ · 👥 {m.group}</span>
              </div>
              <h3 className="mt-2 text-lg font-black leading-tight">{m.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{m.summary}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {m.tags.map((t) => <span key={t} className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">{t}</span>)}
              </div>
              {open && (
                <div className="animate-pop-in mt-3 space-y-3 rounded-2xl bg-violet-50/70 p-3">
                  {m.sections.map((s) => (
                    <div key={s.heading}>
                      <p className="text-xs font-black uppercase tracking-wider text-violet-500">{s.heading}</p>
                      <ul className="mt-1 space-y-1 text-sm font-medium text-slate-700">
                        {s.items.map((it, i) => <li key={i} className="leading-snug">{it}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              <div className="no-print mt-3 flex gap-2 pt-1">
                <button onClick={() => setOpenId(open ? null : m.id)}
                  className="flex-1 rounded-xl bg-violet-600 px-3 py-2 text-sm font-black text-white hover:bg-violet-700">{open ? "Collapse" : "Open plan"}</button>
                <button onClick={() => copyCard(m)} className="rounded-xl border border-violet-200 px-3 py-2 text-sm font-black text-violet-600 hover:bg-violet-50">📋 Copy</button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// ================= ARCADE =================
function ArcadeTab(props: {
  vocab: { term: string; gloss: string; example: string }[];
  langCode: string; langLabel: string; level: ProficiencyLevel;
  xp: number; addXp: (n: number) => void; streak: number; setStreak: (n: number) => void;
  avatar: string; setAvatar: (s: string) => void; codename: string; setCodename: (s: string) => void;
  incognito: boolean; setIncognito: (b: boolean) => void;
  badges: { at: number; icon: string; name: string }[];
}) {
  const { vocab, langCode, addXp, xp } = props;
  const [game, setGame] = useState<string>("sprint");
  const [burst, setBurst] = useState("");
  const cheer = (msg: string, pts: number) => { setBurst(msg); addXp(pts); setTimeout(() => setBurst(""), 1400); };

  const games = [
    { id: "sprint", icon: "⚡", name: "Vocab Sprint", desc: "30-sec match frenzy" },
    { id: "listen", icon: "👂", name: "Listening Quest", desc: "Hear it, find it" },
    { id: "build", icon: "🧱", name: "Sentence Builder", desc: "Click bricks in order" },
    { id: "voice", icon: "🎭", name: "Incognito Voice", desc: "Shy-safe speaking" },
    { id: "bingo", icon: "🎯", name: "Bingo Caller", desc: "Classroom caller" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="h-fit space-y-4">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-violet-900 p-5 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <span className="animate-float-slow grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-4xl">{props.avatar}</span>
            <div>
              <p className="font-black">{props.incognito ? props.codename : "Player One"}</p>
              <p className="text-xs text-violet-300">{props.level} · {props.langLabel} · 🔥 streak {props.streak}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {AVATARS.map((a) => (
              <button key={a} onClick={() => { props.setAvatar(a); try { localStorage.setItem("lp-avatar", a); } catch {} }}
                className={`rounded-xl p-1.5 text-2xl ${props.avatar === a ? "bg-amber-400" : "bg-white/10 hover:bg-white/20"}`}>{a}</button>
            ))}
          </div>
          <select value={props.codename} onChange={(e) => { props.setCodename(e.target.value); try { localStorage.setItem("lp-code", e.target.value); } catch {} }}
            className="mt-2 w-full rounded-xl bg-white/10 px-3 py-2 text-sm font-bold">
            {CODENAMES.map((c) => <option key={c} className="text-black">{c}</option>)}
          </select>
          <label className="mt-3 flex cursor-pointer items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-sm font-bold">
            <span>🎭 Incognito (hide my name)</span>
            <input type="checkbox" checked={props.incognito} onChange={(e) => props.setIncognito(e.target.checked)} className="h-5 w-5 accent-amber-400" />
          </label>
          <div className="mt-3">
            <p className="text-xs font-black uppercase tracking-widest text-violet-300">Badges</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {props.badges.map((b) => (
                <span key={b.name} title={b.name} className={`rounded-full px-2.5 py-1 text-xs font-black ${xp >= b.at ? "bg-amber-400 text-amber-950" : "bg-white/10 text-white/40"}`}>{b.icon} {b.at}XP</span>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-violet-100 bg-white p-4">
          {games.map((g) => (
            <button key={g.id} onClick={() => setGame(g.id)}
              className={`mb-1.5 flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${game === g.id ? "bg-violet-600 text-white shadow-lg" : "hover:bg-violet-50"}`}>
              <span className="text-2xl">{g.icon}</span>
              <span><span className="block font-black">{g.name}</span><span className={`text-xs ${game === g.id ? "text-violet-200" : "text-slate-400"}`}>{g.desc}</span></span>
            </button>
          ))}
        </div>
        <div className="rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
          🛟 Nervous about speaking? Every game has a <b>no-mic path</b>. Whisper, type, or just listen — you earn the same XP. Bravery builds in layers.
        </div>
      </aside>

      <section className="relative rounded-3xl border border-violet-100 bg-white p-6 shadow-sm min-h-[480px]">
        {burst && (
          <div className="animate-pop-in absolute inset-x-0 top-6 z-10 mx-auto w-fit rounded-full bg-gradient-to-r from-amber-400 to-fuchsia-500 px-6 py-3 text-xl font-black text-white shadow-2xl">{burst}</div>
        )}
        {game === "sprint" && <SprintGame vocab={vocab} onScore={(pts) => cheer(`+${pts} XP ⚡`, pts)} />}
        {game === "listen" && <ListenGame vocab={vocab} langCode={langCode} onScore={(pts) => cheer(`+${pts} XP 👂`, pts)} />}
        {game === "build" && <BuildGame vocab={vocab} onScore={(pts) => cheer(`+${pts} XP 🧱`, pts)} />}
        {game === "voice" && <VoiceGame vocab={vocab} langCode={langCode} incognito={props.incognito} codename={props.codename} onScore={(pts) => cheer(`+${pts} XP 🎭`, pts)} />}
        {game === "bingo" && <BingoGame vocab={vocab} langCode={langCode} />}
      </section>
    </div>
  );
}

function SprintGame({ vocab, onScore }: { vocab: { term: string; gloss: string }[]; onScore: (n: number) => void }) {
  const [active, setActive] = useState(false);
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(0);
  const [q, setQ] = useState(0);
  const [opts, setOpts] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const newQ = () => {
    const idx = Math.floor(Math.random() * vocab.length);
    setQ(idx);
    const wrong = shuffle(vocab.filter((_, i) => i !== idx)).slice(0, 3).map((v) => v.gloss || v.term);
    setOpts(shuffle([vocab[idx].gloss || vocab[idx].term, ...wrong]));
  };
  const start = () => {
    setActive(true); setScore(0); setTime(30); newQ();
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setTime((t) => {
      if (t <= 1) { if (timer.current) clearInterval(timer.current); setActive(false); return 0; }
      return t - 1;
    }), 1000);
  };
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  if (!vocab.length) return <p>No vocab yet.</p>;

  return (
    <div className="text-center">
      <h3 className="text-2xl font-black">⚡ Vocab Sprint</h3>
      <p className="text-sm text-slate-500">Match as many as you can in 30 seconds. Wrong answers cost nothing — keep going!</p>
      {!active && time === 30 && score === 0 ? (
        <button onClick={start} className="mx-auto mt-6 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-4 text-xl font-black text-white shadow-xl hover:scale-105">▶ Start sprint</button>
      ) : null}
      {(active || score > 0) && (
        <div className="mx-auto mt-4 max-w-md">
          <div className="flex items-center justify-between font-black">
            <span className="rounded-full bg-violet-100 px-4 py-1 text-violet-700">⏱ {time}s</span>
            <span className="rounded-full bg-amber-100 px-4 py-1 text-amber-700">⭐ {score}</span>
          </div>
          {active ? (
            <>
              <p className="mt-6 text-4xl font-black">{vocab[q]?.term}</p>
              <div className="mt-4 grid gap-2">
                {opts.map((o) => (
                  <button key={o} onClick={() => {
                    if (o === (vocab[q].gloss || vocab[q].term)) { setScore((s) => s + 1); onScore(2); }
                    newQ();
                  }} className="rounded-2xl border-2 border-violet-100 bg-violet-50/50 px-4 py-3 font-bold hover:border-violet-400 hover:bg-violet-100">{o}</button>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 p-8 text-white">
              <p className="text-5xl">🏁</p>
              <p className="mt-2 text-3xl font-black">{score} correct!</p>
              <p className="text-violet-200">{score >= 8 ? "Blazing! Sprint legend." : score >= 4 ? "Solid — one more run?" : "Warming up — speed comes with reps."}</p>
              <button onClick={start} className="mt-4 rounded-xl bg-white px-6 py-2 font-black text-violet-700">Play again</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ListenGame({ vocab, langCode, onScore }: { vocab: { term: string; gloss: string; example: string }[]; langCode: string; onScore: (n: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [opts, setOpts] = useState<string[]>([]);
  const [streakOk, setStreakOk] = useState(0);
  const [msg, setMsg] = useState("");

  const deal = (i?: number) => {
    const n = i ?? Math.floor(Math.random() * vocab.length);
    setIdx(n);
    setOpts(shuffle([vocab[n].term, ...shuffle(vocab.filter((_, k) => k !== n)).slice(0, 3).map((v) => v.term)]));
    setMsg("");
  };
  useEffect(() => { if (vocab.length) deal(0); }, [vocab.length]);
  if (!vocab.length) return <p>No vocab.</p>;

  return (
    <div className="mx-auto max-w-md text-center">
      <h3 className="text-2xl font-black">👂 Listening Quest</h3>
      <p className="text-sm text-slate-500">Press play, listen carefully, tap what you heard. Replay as much as you want.</p>
      <button onClick={() => speak(vocab[idx].term + ". " + (vocab[idx].example || ""), langCode)}
        className="mx-auto mt-6 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-violet-600 text-4xl text-white shadow-xl transition hover:scale-105">🔊</button>
      <p className="mt-2 text-xs font-bold text-slate-400">meaning hint: “{vocab[idx].gloss}”</p>
      <div className="mt-4 grid gap-2">
        {opts.map((o) => (
          <button key={o} onClick={() => {
            if (o === vocab[idx].term) { setStreakOk((s) => s + 1); onScore(5); deal(); }
            else setMsg("Not quite — hit 🔊 and try again. No points lost. 💪");
          }} className="rounded-2xl border-2 border-sky-100 bg-sky-50/60 px-4 py-3 text-lg font-bold hover:border-sky-400">{o}</button>
        ))}
      </div>
      {msg && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-700">{msg}</p>}
      <p className="mt-3 text-sm font-black text-emerald-600">🔥 {streakOk} in a row this session</p>
    </div>
  );
}

function BuildGame({ vocab, onScore }: { vocab: { term: string; gloss: string }[]; onScore: (n: number) => void }) {
  // Build a tiny sentence puzzle from vocab: pick 4 terms, order them as a "sentence"
  const [round, setRound] = useState(0);
  const [tray, setTray] = useState<string[]>([]);
  const [built, setBuilt] = useState<string[]>([]);
  const [msg, setMsg] = useState("");

  const setup = () => {
    const picks = shuffle(vocab).slice(0, 4).map((v) => v.term);
    setTray(shuffle(picks));
    (setup as { answer?: string[] }).answer = picks;
    setBuilt([]); setMsg("");
  };
  useEffect(() => { setup(); }, [vocab.length, round]);
  const answer = (setup as { answer?: string[] }).answer ?? [];

  return (
    <div className="mx-auto max-w-lg text-center">
      <h3 className="text-2xl font-black">🧱 Sentence Builder</h3>
      <p className="text-sm text-slate-500">Tap bricks in the <b>same order as the pattern</b> — it trains word order without any grammar lecture.</p>
      <div className="mt-4 rounded-2xl bg-violet-50 p-4">
        <p className="text-xs font-black uppercase tracking-widest text-violet-400">Pattern to copy</p>
        <p className="text-xl font-black text-violet-800">{answer.join(" · ") || "…"}</p>
      </div>
      <div className="mt-4 min-h-[64px] rounded-2xl border-2 border-dashed border-violet-200 p-3">
        {built.length === 0 && <span className="text-sm text-slate-400">Your sentence appears here…</span>}
        <div className="flex flex-wrap justify-center gap-2">
          {built.map((b, i) => (
            <button key={i} onClick={() => { setBuilt(built.filter((_, k) => k !== i)); setTray([...tray, b]); }}
              className="rounded-xl bg-violet-600 px-3 py-2 font-bold text-white">{b}</button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {tray.map((t, i) => (
          <button key={i} onClick={() => { setBuilt([...built, t]); setTray(tray.filter((_, k) => k !== i)); }}
            className="rounded-xl border-2 border-amber-200 bg-amber-50 px-3 py-2 font-bold text-amber-800 hover:bg-amber-100">{t}</button>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <button onClick={() => {
          if (JSON.stringify(built) === JSON.stringify(answer)) { setMsg("🎉 Perfect order! That's a real sentence pattern."); onScore(8); }
          else setMsg("Almost — compare with the pattern and shuffle one brick. Trying again is free.");
        }} className="rounded-xl bg-emerald-500 px-6 py-2.5 font-black text-white hover:bg-emerald-600">Check ✓</button>
        <button onClick={() => setRound((r) => r + 1)} className="rounded-xl border border-violet-200 px-6 py-2.5 font-black text-violet-600">↻ New bricks</button>
      </div>
      {msg && <p className="mx-auto mt-3 w-fit rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">{msg}</p>}
    </div>
  );
}

function VoiceGame({ vocab, langCode, incognito, codename, onScore }: {
  vocab: { term: string; gloss: string; example: string }[]; langCode: string;
  incognito: boolean; codename: string; onScore: (n: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [heard, setHeard] = useState("");
  const [listening, setListening] = useState(false);
  const [micOK, setMicOK] = useState<boolean | null>(null);
  const [said, setSaid] = useState(0);

  const next = () => { setIdx(Math.floor(Math.random() * vocab.length)); setHeard(""); };

  const tryMic = () => {
    type Rec = {
      lang: string; interimResults: boolean;
      onresult: ((e: { results: { transcript: string }[][] }) => void) | null;
      onerror: (() => void) | null; onend: (() => void) | null;
      start: () => void;
    };
    const w = window as unknown as { webkitSpeechRecognition?: new () => Rec; SpeechRecognition?: new () => Rec };
    const SR = w.webkitSpeechRecognition ?? w.SpeechRecognition;
    if (!SR) { setMicOK(false); return; }
    try {
      const rec = new SR();
      rec.lang = langCode;
      rec.interimResults = false;
      setListening(true); setMicOK(true);
      rec.onresult = (e) => {
        const t = e.results[0][0].transcript;
        setHeard(t); setListening(false);
        setSaid((s) => s + 1); onScore(10);
      };
      rec.onerror = () => { setListening(false); setMicOK(false); };
      rec.onend = () => setListening(false);
      rec.start();
    } catch { setMicOK(false); }
  };

  const cur = vocab[idx] ?? vocab[0];
  if (!cur) return <p>No vocab.</p>;

  return (
    <div className="mx-auto max-w-lg text-center">
      <h3 className="text-2xl font-black">🎭 Incognito Voice</h3>
      <p className="text-sm text-slate-500">
        Performing as <b>{incognito ? codename : "yourself"}</b> · nobody hears you but you.
        Steps: <b>1. Listen → 2. Whisper → 3. Claim XP.</b> Mic is optional.
      </p>
      <div className="mt-5 rounded-3xl bg-gradient-to-br from-violet-700 to-fuchsia-600 p-6 text-white shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200">Your secret line</p>
        <p className="mt-1 text-4xl font-black">“{cur.term}”</p>
        <p className="mt-1 text-violet-100">means “{cur.gloss}” {cur.example ? `· e.g. ${cur.example}` : ""}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button onClick={() => speak(cur.term, langCode)} className="rounded-xl bg-white px-4 py-2 font-black text-violet-700">🔊 Hear it</button>
          <button onClick={() => speak(cur.term, langCode)} className="rounded-xl bg-white/20 px-4 py-2 font-black">🐢 Slow</button>
          <button onClick={next} className="rounded-xl bg-white/20 px-4 py-2 font-black">↻ New line</button>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <button onClick={tryMic} className={`rounded-2xl px-4 py-3 font-black text-white ${listening ? "animate-pulse bg-rose-500" : "bg-violet-600 hover:bg-violet-700"}`}>
          {listening ? "● Listening…" : "🎙️ Try mic"}
        </button>
        <button onClick={() => { setSaid((s) => s + 1); onScore(6); setHeard("(whisper practice — counted!)"); }} className="rounded-2xl bg-emerald-500 px-4 py-3 font-black text-white hover:bg-emerald-600">🤫 I whispered it</button>
        <button onClick={() => { setSaid((s) => s + 1); onScore(4); }} className="rounded-2xl border-2 border-violet-200 px-4 py-3 font-black text-violet-600 hover:bg-violet-50">⌨️ I typed it</button>
      </div>
      {micOK === false && <p className="mt-2 rounded-xl bg-amber-50 p-2 text-xs font-bold text-amber-700">No mic detected — totally fine! Whisper or type paths earn full credit here.</p>}
      {heard && <p className="mt-3 rounded-2xl bg-slate-900 p-3 text-sm font-bold text-emerald-300">We heard: “{heard}” — brave work, {incognito ? codename : "star"}! 🎉</p>}
      <p className="mt-3 text-sm font-black text-violet-600">🗣️ Lines braved this session: {said}</p>
      <div className="mt-2 rounded-2xl bg-violet-50 p-3 text-left text-xs font-semibold text-violet-800">
        🧠 Why this works: kids who said speaking is “embarrassing” usually fear <b>public error</b>, not the language. Masks + whispers + scripts remove the audience while keeping real mouth movement — the ACTFL interpersonal mode, rehearsed safely.
      </div>
    </div>
  );
}

function BingoGame({ vocab, langCode }: { vocab: { term: string; gloss: string }[]; langCode: string }) {
  const [drawn, setDrawn] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const draw = () => {
    const pool = vocab.map((v) => v.term).filter((t) => !drawn.includes(t));
    if (!pool.length) { setCurrent("🎉 Full board! Reset to play again."); return; }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setCurrent(pick); setDrawn([...drawn, pick]);
    speak(pick, langCode);
  };
  return (
    <div className="mx-auto max-w-lg text-center">
      <h3 className="text-2xl font-black">🎯 Bingo Caller</h3>
      <p className="text-sm text-slate-500">Project this. Students mark printed bingo boards from the Vault. Caller reads aloud — class echoes in a whisper.</p>
      <div className="mt-4 rounded-3xl bg-slate-900 p-8 text-white">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">Now calling</p>
        <p className="mt-1 text-4xl font-black text-amber-300">{current ?? "Press DRAW to start"}</p>
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={draw} className="rounded-xl bg-amber-400 px-6 py-2.5 font-black text-amber-950 hover:bg-amber-300">🎲 DRAW</button>
          <button onClick={() => { setDrawn([]); setCurrent(null); }} className="rounded-xl bg-white/10 px-6 py-2.5 font-black">Reset</button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {drawn.map((d) => <span key={d} className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">{d}</span>)}
      </div>
    </div>
  );
}

// ================= GUIDE =================
function GuideTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-violet-900 to-fuchsia-800 p-8 text-white">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-300">How this app stays ACTFL-connected</p>
        <h2 className="mt-1 text-3xl font-black">Not “fun games + standards slapped on.”<br />Games <span className="text-amber-300">inside</span> the three modes.</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            ["👂 Interpretive", "Listen / read to understand. Arcade: Listening Quest + Sprint. Vault: dictation grid, tiered reading, quiz."],
            ["💬 Interpersonal", "Spontaneous back-and-forth. Arcade: Incognito Voice. Vault: whisper role plays, info-gap, bingo mingle."],
            ["🎤 Presentational", "Rehearsed message for an audience. Arcade: Sentence Builder. Vault: story dice, builders, exit line."],
          ].map(([h, d]) => (
            <div key={h} className="rounded-2xl bg-white/10 p-4 backdrop-blur"><p className="font-black">{h}</p><p className="mt-1 text-sm text-violet-100">{d}</p></div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-violet-100 bg-white p-6">
          <h3 className="text-xl font-black">🪜 Proficiency ladder (what changes)</h3>
          <div className="mt-3 space-y-2">
            {LEVELS.map((l, i) => (
              <div key={l} className="flex items-center gap-3">
                <span className="w-36 shrink-0 rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">{l}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-violet-100"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${((i + 1) / LEVELS.length) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-500">Novice = words &amp; chunks · Intermediate = sentences &amp; narration. The generator auto-adjusts scaffolds to whichever level you pick in the Studio.</p>
        </div>
        <div className="rounded-3xl border border-violet-100 bg-white p-6">
          <h3 className="text-xl font-black">🌍 The 5 Cs in this app</h3>
          <div className="mt-3 space-y-2.5">
            {FIVE_CS.map((c) => (
              <div key={c.letter} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-black text-white ${c.color}`}>{c.letter}</span>
                <span><span className="block font-black">{c.name}</span><span className="text-sm text-slate-500">{c.desc}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-dashed border-violet-200 bg-violet-50/60 p-6">
        <h3 className="text-xl font-black">😳 For the “speaking is embarrassing” kids</h3>
        <ol className="mt-2 list-decimal space-y-1.5 pl-6 text-sm font-medium text-violet-950">
          <li><b>Remove the audience first.</b> Avatar codenames + whisper rounds + pair-only performances. Whole-class solos are earned, never assigned cold.</li>
          <li><b>Script before spontaneity.</b> Every role play prints exact lines; creativity = swapping one brick, not inventing under stare.</li>
          <li><b>Credit every channel.</b> Say it, whisper it, mouth it, type it — same XP. The mouth still moves; shame doesn&apos;t gatekeep points.</li>
          <li><b>Games before grades.</b> Sprint, bingo, and charades build recognition fluency so when speech comes, the words are already friends.</li>
        </ol>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight, BookOpen, Check, ChevronDown, CircleHelp, Clock3, Copy, Dices,
  Eye, FileText, Gamepad2, GraduationCap, Headphones, Home as HomeIcon, Library,
  LockKeyhole, MessageCircleMore, Mic2, MoreHorizontal, Play, Plus,
  Presentation, Search, Settings, ShieldCheck, Sparkles, Star, Target,
  Trophy, Users, Volume2, WandSparkles, X, Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Mode = "All" | "Interpersonal" | "Interpretive" | "Presentational";
type Activity = {
  title: string;
  description: string;
  mode: Exclude<Mode, "All">;
  time: string;
  format: string;
  color: string;
  icon: LucideIcon;
};

const activities: Activity[] = [
  ["Secret Signal", "Partners give clues to unlock a hidden neighborhood location.", "Interpersonal", "8 min", "Speaking game", "coral", LockKeyhole],
  ["Sound Map", "Listen to three directions and pin each destination on the map.", "Interpretive", "7 min", "Listening", "blue", Headphones],
  ["Postcard Dash", "Create a 30-second neighborhood tour for a visiting student.", "Presentational", "10 min", "Creative sprint", "purple", Presentation],
  ["Route Remix", "Teams rebuild mixed-up directions before the timer runs out.", "Interpretive", "6 min", "Team puzzle", "lime", Dices],
  ["Ask the Local", "Role-play a visitor and local using question support cards.", "Interpersonal", "9 min", "Partner quest", "yellow", Users],
  ["My Perfect Block", "Pitch an ideal neighborhood using five target expressions.", "Presentational", "12 min", "Mini pitch", "pink", Mic2],
  ["Odd Map Out", "Find the one route that does not match the audio clue.", "Interpretive", "5 min", "Quick check", "blue", Eye],
  ["Compass Clash", "Take turns guiding a teammate around surprise obstacles.", "Interpersonal", "8 min", "Speaking game", "coral", Gamepad2],
  ["One-Minute Guide", "Record a low-stakes audio guide, then choose your best take.", "Presentational", "9 min", "Audio creation", "purple", Volume2],
  ["Clue Collector", "Gather details from short messages to identify a mystery place.", "Interpretive", "7 min", "Mystery", "lime", Search],
  ["Info Gap: Lost!", "Each partner holds half the map; questions reveal the route.", "Interpersonal", "10 min", "Info gap", "yellow", CircleHelp],
  ["Neighborhood Awards", "Nominate and defend the most useful place for three residents.", "Presentational", "11 min", "Persuasion", "pink", Trophy],
  ["Emoji Directions", "Decode visual route clues into complete target-language steps.", "Interpretive", "6 min", "Visual puzzle", "blue", Sparkles],
  ["Find My Spot", "Describe a location while classmates race to identify it.", "Interpersonal", "7 min", "Class game", "coral", Target],
  ["Tour Guide Comic", "Build a four-frame route story with captions and speech bubbles.", "Presentational", "14 min", "Visual story", "purple", FileText],
  ["True Route / Trap Route", "Compare directions with a map and catch one planted error.", "Interpretive", "5 min", "Error hunt", "lime", ShieldCheck],
  ["Speed Swap", "Repeat a short exchange with new partners and playful twists.", "Interpersonal", "8 min", "Fluency rounds", "yellow", Zap],
  ["Local Legend", "Tell a tiny story explaining how a place got its nickname.", "Presentational", "10 min", "Storytelling", "pink", Star],
  ["Map Memory", "Study a route for 20 seconds, then rebuild it from audio clues.", "Interpretive", "7 min", "Memory game", "blue", Eye],
  ["Detour Duel", "Partners negotiate a new route when surprise roadblocks appear.", "Interpersonal", "9 min", "Strategy game", "coral", Dices],
  ["City Radio", "Record a lively traffic update using location and direction phrases.", "Presentational", "8 min", "Audio challenge", "purple", Mic2],
  ["Who Lives Where?", "Match short resident descriptions to places on the neighborhood map.", "Interpretive", "6 min", "Logic puzzle", "lime", Search],
  ["Mystery Meetup", "Ask classmates yes-or-no questions to discover a meeting place.", "Interpersonal", "10 min", "Social mystery", "yellow", Users],
  ["Three-Stop Tour", "Design and share a mini itinerary for a new student in town.", "Presentational", "12 min", "Tour builder", "pink", Presentation],
].map(([title, description, mode, time, format, color, icon]) => ({
  title, description, mode, time, format, color, icon,
})) as Activity[];

const colors: Record<string, string> = {
  coral: "bg-[#ffddd2] text-[#b84231]", blue: "bg-[#dcecff] text-[#265b9b]",
  purple: "bg-[#e9e1ff] text-[#6246a8]", lime: "bg-[#e2f3c3] text-[#487220]",
  yellow: "bg-[#fff0bd] text-[#8a6415]", pink: "bg-[#ffe0ed] text-[#9f4168]",
};
const modeStyle = {
  Interpersonal: "bg-[#fff0eb] text-[#b64c3a] border-[#ffd7cd]",
  Interpretive: "bg-[#eaf4ff] text-[#376899] border-[#d4e9ff]",
  Presentational: "bg-[#f1edff] text-[#684f9d] border-[#e2d9ff]",
};

export default function Home() {
  const [mode, setMode] = useState<Mode>("All");
  const [showAll, setShowAll] = useState(false);
  const [lesson, setLesson] = useState("Students will navigate a neighborhood, ask for and give directions, and describe where community places are located. Target phrases: está cerca de, sigue derecho, gira a la izquierda/derecha.");
  const [topic, setTopic] = useState("Neighborhood & directions");
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const filtered = useMemo(
    () => activities.filter((activity) => mode === "All" || activity.mode === mode),
    [mode],
  );
  const visible = showAll ? filtered : filtered.slice(0, 6);

  function generatePack() {
    setIsGenerating(true);
    window.setTimeout(() => setIsGenerating(false), 900);
  }
  function copyCode() {
    navigator.clipboard?.writeText("VIVA-42");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#17233d]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[232px] border-r border-[#e8e3d8] bg-[#fffdf8] px-4 py-5 lg:flex lg:flex-col">
        <Brand />
        <nav className="mt-9 space-y-1.5" aria-label="Main navigation">
          <Nav icon={HomeIcon} label="Home" />
          <Nav icon={WandSparkles} label="Lesson studio" active />
          <Nav icon={Library} label="My library" />
          <Nav icon={Gamepad2} label="Live games" />
          <Nav icon={GraduationCap} label="Classes" />
        </nav>
        <div className="mt-auto">
          <div className="mb-4 overflow-hidden rounded-[22px] bg-[#182641] p-4 text-white">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff765e]">
              <Sparkles className="h-4 w-4" />
            </div>
            <p className="text-sm font-bold">3 packs this week</p>
            <p className="mt-1 text-xs leading-5 text-white/65">You saved about 2 hours of prep.</p>
          </div>
          <Nav icon={Settings} label="Settings" />
          <button className="mt-3 flex w-full items-center gap-3 rounded-2xl p-2 text-left transition hover:bg-[#f4f0e8]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4c6a6] text-xs font-extrabold text-[#633d2d]">MR</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">Maya Rivera</span>
              <span className="block truncate text-[11px] text-[#7f8796]">Spanish 7</span>
            </span>
            <MoreHorizontal className="h-4 w-4 text-[#8d94a1]" />
          </button>
        </div>
      </aside>

      <main className="pb-24 lg:ml-[232px] lg:pb-10">
        <header className="sticky top-0 z-20 border-b border-[#e8e3d8]/80 bg-[#f7f5ef]/90 px-4 py-3 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="mx-auto flex max-w-[1360px] items-center justify-between">
            <div className="lg:hidden"><Brand /></div>
            <div className="hidden lg:block">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#9197a1]">Monday, October 5</p>
              <h1 className="mt-0.5 text-lg font-extrabold">Lesson studio</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setGameOpen(true)} className="hidden h-10 items-center gap-2 rounded-full border border-[#ded9cf] bg-white px-4 text-xs font-bold shadow-sm transition hover:-translate-y-0.5 sm:flex">
                <Play className="h-3.5 w-3.5 fill-current text-[#ff6c55]" /> Preview student game
              </button>
              <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#ded9cf] bg-white shadow-sm" aria-label="Messages">
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#ff6c55]" />
                <MessageCircleMore className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1360px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
          <section className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#e4f4c5] px-3 py-1 text-[11px] font-extrabold text-[#4d7428]">
                <Sparkles className="h-3 w-3" /> Prep less. Play more.
              </div>
              <h2 className="text-[30px] font-black leading-tight tracking-[-0.035em] sm:text-[38px]">
                Turn one lesson into <span className="relative whitespace-nowrap text-[#ef634e]">many ways to speak.
                  <svg aria-hidden="true" className="absolute -bottom-2 left-0 h-3 w-full" viewBox="0 0 240 12" preserveAspectRatio="none">
                    <path d="M3 8C60 2 162 3 237 6" fill="none" stroke="#f7b239" strokeLinecap="round" strokeWidth="5" />
                  </svg>
                </span>
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#687183] sm:text-[15px]">Add what you already teach. Luma builds playful, low-pressure practice across all three communication modes.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#697184]">
              <ShieldCheck className="h-4 w-4 text-[#5f8c35]" /> Teacher reviews before students see anything
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,.75fr)]">
            <div className="rounded-[28px] border border-[#e7e1d6] bg-[#fffefa] p-4 shadow-[0_12px_35px_rgba(36,43,62,0.06)] sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ffe4dd] text-[#d95844]"><BookOpen className="h-5 w-5" /></span>
                  <div><h3 className="font-extrabold">Start with your lesson</h3><p className="text-xs text-[#858c98]">Paste a plan, objective, or a few target phrases.</p></div>
                </div>
                <Badge variant="outline" className="hidden rounded-full border-[#e5ded2] bg-white px-3 py-1 text-[10px] text-[#747c8c] sm:inline-flex">Auto-saved</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-extrabold text-[#4d5668]">Lesson focus</span>
                  <Input value={topic} onChange={(e) => setTopic(e.target.value)} className="h-11 rounded-xl border-[#ded9cf] bg-white font-semibold shadow-none focus-visible:border-[#ff765e] focus-visible:ring-[#ff765e]/15" />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Picker label="Language" value="spanish" items={[["spanish", "Spanish"], ["french", "French"], ["german", "German"], ["mandarin", "Mandarin"]]} />
                  <Picker label="Level" value="novice-high" items={[["novice-low", "Novice Low"], ["novice-mid", "Novice Mid"], ["novice-high", "Novice High"], ["intermediate-low", "Intermediate Low"]]} />
                </div>
              </div>
              <label className="mt-4 block space-y-2">
                <span className="flex items-center justify-between text-xs font-extrabold text-[#4d5668]">Lesson notes <span className="font-medium text-[#9aa0aa]">{lesson.length}/600</span></span>
                <Textarea value={lesson} onChange={(e) => setLesson(e.target.value.slice(0, 600))} className="min-h-[126px] resize-none rounded-2xl border-[#ded9cf] bg-white p-4 text-[13px] leading-6 shadow-none focus-visible:border-[#ff765e] focus-visible:ring-[#ff765e]/15" />
              </label>
              <div className="mt-5 flex flex-col gap-3 border-t border-[#eee9df] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2"><Pill icon={Clock3} text="45 minutes" /><Pill icon={Users} text="Pairs + teams" /><Pill icon={Mic2} text="Low-pressure speaking" /></div>
                <Button onClick={generatePack} disabled={isGenerating || !lesson.trim()} className="h-12 rounded-2xl bg-[#ff6c55] px-6 font-extrabold text-white shadow-[0_8px_18px_rgba(255,108,85,0.28)] transition hover:-translate-y-0.5 hover:bg-[#ed5d47]">
                  {isGenerating ? <><Sparkles className="animate-pulse" /> Building your pack…</> : <><WandSparkles /> Build my activity pack</>}
                </Button>
              </div>
            </div>

            <aside className="relative overflow-hidden rounded-[28px] bg-[#1d2b49] p-6 text-white shadow-[0_14px_36px_rgba(29,43,73,0.18)]">
              <div className="absolute -right-12 -top-10 h-40 w-40 rounded-full border-[28px] border-white/5" />
              <div className="relative">
                <div className="flex items-center justify-between"><span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#aeb9cd]">Alignment pulse</span><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><Target className="h-4 w-4 text-[#f8b743]" /></span></div>
                <h3 className="mt-5 text-xl font-black leading-tight">Balanced practice,<br />without the busywork.</h3>
                <p className="mt-2 text-xs leading-5 text-[#b8c2d2]">Your pack touches all ACTFL communication modes at a Novice High performance range.</p>
                <div className="mt-6 space-y-4">
                  <ModeProgress label="Interpersonal" value="8 activities" width="74%" color="bg-[#ff806c]" />
                  <ModeProgress label="Interpretive" value="8 activities" width="74%" color="bg-[#71b5f8]" />
                  <ModeProgress label="Presentational" value="8 activities" width="74%" color="bg-[#a993eb]" />
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e5f2c8] text-[#486822]"><Check className="h-4 w-4" strokeWidth={3} /></span>
                    <div><p className="text-xs font-extrabold">Can-do focus</p><p className="mt-1 text-[11px] leading-5 text-[#c1cad8]">I can ask for and give simple directions to familiar places.</p></div>
                  </div>
                </div>
              </div>
            </aside>
          </section>

          <section className="mt-8" aria-live="polite">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-2"><h3 className="text-xl font-black tracking-[-0.02em]">Your activity pack</h3><Badge className="rounded-full bg-[#e3f1c7] px-2.5 text-[#4c702a] hover:bg-[#e3f1c7]">{isGenerating ? "Building…" : "24 ready"}</Badge></div>
                <p className="mt-1 text-xs text-[#7e8593]">Mix, edit, and save only what fits your class.</p>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-[#e3ded4] bg-[#fffefa] p-1.5">
                {(["All", "Interpersonal", "Interpretive", "Presentational"] as Mode[]).map((item) => (
                  <button key={item} onClick={() => { setMode(item); setShowAll(false); }} className={`whitespace-nowrap rounded-xl px-3 py-2 text-[11px] font-extrabold transition ${mode === item ? "bg-[#1d2b49] text-white shadow-sm" : "text-[#747c8b] hover:bg-[#f5f1e9]"}`}>{item}</button>
                ))}
              </div>
            </div>
            <div className={`grid gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${isGenerating ? "opacity-35" : "opacity-100"}`}>
              {visible.map((activity) => <ActivityCard key={activity.title} activity={activity} onLaunch={() => setGameOpen(true)} />)}
            </div>
            {filtered.length > 6 && <div className="mt-5 flex justify-center"><Button variant="outline" onClick={() => setShowAll((v) => !v)} className="h-11 rounded-2xl border-[#ded9cf] bg-[#fffefa] px-5 font-bold text-[#344057] shadow-none hover:bg-white">{showAll ? "Show fewer" : `See all ${filtered.length} activities`}<ChevronDown className={`transition-transform ${showAll ? "rotate-180" : ""}`} /></Button></div>}
          </section>

          <section className="mt-9 overflow-hidden rounded-[30px] bg-[#f2b640]">
            <div className="grid lg:grid-cols-[1fr_1.05fr]">
              <div className="p-6 sm:p-9">
                <Badge className="rounded-full bg-[#1d2b49] px-3 py-1 text-white hover:bg-[#1d2b49]"><Gamepad2 className="mr-1 h-3 w-3" /> Game spotlight</Badge>
                <h3 className="mt-5 max-w-md text-3xl font-black leading-[1.05] tracking-[-0.04em] text-[#1d2b49]">Speaking practice that feels like play, not a performance.</h3>
                <p className="mt-4 max-w-lg text-sm leading-6 text-[#57451f]">Secret Signal gives every student private rehearsal time, visual support, and a shared team goal—so no one is put on the spot.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button onClick={() => setGameOpen(true)} className="h-12 rounded-2xl bg-[#1d2b49] px-5 font-extrabold text-white hover:bg-[#26385f]"><Play className="fill-current" /> Try the student view</Button>
                  <Button variant="outline" className="h-12 rounded-2xl border-[#725b29]/20 bg-white/40 px-5 font-extrabold text-[#1d2b49] hover:bg-white/60">How it works</Button>
                </div>
              </div>
              <div className="relative min-h-[300px] overflow-hidden bg-[#e9a92c] p-6">
                <div className="absolute inset-x-0 bottom-0 mx-auto h-[88%] w-[86%] rounded-t-[36px] bg-[#fffdf8] p-5 shadow-2xl sm:w-[72%] lg:w-[80%]">
                  <div className="flex items-center justify-between"><span className="text-xs font-black text-[#1d2b49]">SECRET SIGNAL</span><span className="rounded-full bg-[#edf1f7] px-2.5 py-1 text-[10px] font-bold text-[#667083]">Round 2 of 5</span></div>
                  <div className="mt-5 rounded-[22px] bg-[#654cc0] p-5 text-white">
                    <div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-[.15em] text-white/60">Get your partner here</span><LockKeyhole className="h-4 w-4 text-[#f6cd66]" /></div>
                    <p className="text-2xl font-black">la biblioteca</p>
                    <div className="mt-5 flex gap-2">{["libros", "leer", "escuela"].map((word) => <span key={word} className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold line-through opacity-70">{word}</span>)}</div>
                  </div>
                  <div className="mt-4 flex gap-3"><div className="flex flex-1 items-center gap-2 rounded-xl bg-[#e5f1c8] p-3 text-[11px] font-bold text-[#486722]"><Mic2 className="h-4 w-4" /> Quiet rehearsal on</div><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffded5] text-[#c64f3e]"><Volume2 className="h-4 w-4" /></div></div>
                </div>
              </div>
            </div>
          </section>
          <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-[#e3ded4] pt-5 text-[10px] leading-5 text-[#8c929d] sm:flex-row">
            <p>Alignment support is based on the ACTFL World-Readiness framework. Luma is not affiliated with or endorsed by ACTFL.</p><p>Built for joyful, culturally responsive language learning.</p>
          </footer>
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-[#e6e1d8] bg-[#fffdf8]/95 px-2 py-2 backdrop-blur lg:hidden">
        <MobileNav icon={HomeIcon} label="Home" /><MobileNav icon={WandSparkles} label="Studio" active />
        <button className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#f7f5ef] bg-[#ff6c55] text-white shadow-lg" aria-label="New lesson"><Plus className="h-6 w-6" /></button>
        <MobileNav icon={Library} label="Library" /><MobileNav icon={Gamepad2} label="Games" />
      </nav>

      <Dialog open={gameOpen} onOpenChange={setGameOpen}>
        <DialogContent className="max-h-[94vh] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:max-w-[860px] [&>button]:hidden">
          <DialogHeader className="sr-only"><DialogTitle>Secret Signal student game preview</DialogTitle><DialogDescription>A low-pressure speaking game for partner practice.</DialogDescription></DialogHeader>
          <div className="overflow-hidden rounded-[30px] bg-[#392d77] text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f2b640] text-[#382b69]"><Gamepad2 className="h-5 w-5" /></span><div><p className="text-xs font-black uppercase tracking-[.13em] text-white/50">Secret Signal</p><p className="text-sm font-extrabold">Team Sol · Round 2 of 5</p></div></div>
              <button onClick={() => setGameOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close preview"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[1fr_260px]">
              <div>
                <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-bold text-[#cabffa]">Your mission</p><h4 className="mt-1 text-2xl font-black">Guide your partner to the place.</h4></div><div className="hidden items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[11px] font-bold sm:flex"><Clock3 className="h-3.5 w-3.5 text-[#f3c44e]" /> 0:42</div></div>
                <div className="rounded-[26px] bg-[#fffdf8] p-5 text-[#17233d] sm:p-7">
                  <div className="flex items-center justify-between"><Badge className="rounded-full bg-[#e5f1c8] text-[#486722] hover:bg-[#e5f1c8]"><LockKeyhole className="mr-1 h-3 w-3" /> Only you can see this</Badge><span className="text-[10px] font-bold uppercase tracking-[.12em] text-[#9a9faa]">Target place</span></div>
                  <div className="py-9 text-center"><p className="text-4xl font-black tracking-[-.04em] text-[#5b45b0] sm:text-5xl">{revealed ? "la biblioteca" : "••••••••••"}</p><button onClick={() => setRevealed((v) => !v)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#eee9ff] px-4 py-2 text-xs font-extrabold text-[#654cc0]"><Eye className="h-3.5 w-3.5" /> {revealed ? "Hide my place" : "Tap to reveal privately"}</button></div>
                  <div className="rounded-2xl bg-[#f5f2eb] p-4"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[#8c929d]">Try one of these starters</p><div className="mt-3 flex flex-wrap gap-2">{["Sigue derecho…", "Gira a la…", "Está cerca de…"].map((phrase) => <button key={phrase} className="rounded-xl border border-[#e0dbd1] bg-white px-3 py-2 text-xs font-bold shadow-sm">{phrase}</button>)}</div></div>
                </div>
              </div>
              <aside className="space-y-4">
                <div className="rounded-[22px] bg-white/10 p-4"><div className="flex items-center justify-between"><p className="text-xs font-extrabold">Team energy</p><Trophy className="h-4 w-4 text-[#f5c74f]" /></div><div className="mt-4 flex items-end justify-between"><span className="text-3xl font-black">340</span><span className="text-[10px] font-bold text-white/55">+80 this round</span></div><Progress value={68} className="mt-3 h-2 bg-white/10 [&>div]:bg-[#f2b640]" /></div>
                <div className="rounded-[22px] bg-[#e6f2ca] p-4 text-[#213318]"><div className="flex items-center gap-2"><Mic2 className="h-4 w-4" /><p className="text-xs font-black">No spotlight mode</p></div><p className="mt-2 text-[11px] leading-5 text-[#556d42]">Rehearse quietly first. Only your partner hears your clue.</p></div>
                <div className="rounded-[22px] bg-white/10 p-4"><p className="text-[10px] font-black uppercase tracking-[.13em] text-white/50">Join this game</p><button onClick={copyCode} className="mt-2 flex w-full items-center justify-between rounded-xl bg-white px-3 py-3 text-left text-[#17233d]"><span className="font-black tracking-[.14em]">VIVA-42</span>{copied ? <Check className="h-4 w-4 text-[#5c8d31]" /> : <Copy className="h-4 w-4 text-[#7c8492]" />}</button></div>
                <Button className="h-12 w-full rounded-2xl bg-[#ff765e] font-black text-white hover:bg-[#ed654f]">I gave my clue <ArrowRight /></Button>
              </aside>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Brand() {
  return <div className="flex items-center gap-2.5"><span className="relative flex h-9 w-9 rotate-[-6deg] items-center justify-center rounded-[13px] bg-[#ff6c55] text-white shadow-[inset_-3px_-3px_0_rgba(0,0,0,.08)]"><MessageCircleMore className="h-5 w-5" fill="currentColor" /><span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#fffdf8] bg-[#f4b73f]" /></span><span className="text-xl font-black tracking-[-0.04em] text-[#17233d]">luma</span><span className="rounded-full bg-[#e4f4c5] px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#50722f]">beta</span></div>;
}
function Nav({ icon: Icon, label, active = false }: { icon: LucideIcon; label: string; active?: boolean }) {
  return <button className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-[#ffe7e0] text-[#ca4e3b]" : "text-[#667083] hover:bg-[#f5f1e9] hover:text-[#27334a]"}`}><Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.5 : 2} />{label}{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#ef674f]" />}</button>;
}
function MobileNav({ icon: Icon, label, active = false }: { icon: LucideIcon; label: string; active?: boolean }) {
  return <button className={`flex min-w-12 flex-col items-center gap-1 text-[9px] font-bold ${active ? "text-[#e95f49]" : "text-[#7e8693]"}`}><Icon className="h-5 w-5" />{label}</button>;
}
function Picker({ label, value, items }: { label: string; value: string; items: string[][] }) {
  return <label className="space-y-2"><span className="text-xs font-extrabold text-[#4d5668]">{label}</span><Select defaultValue={value}><SelectTrigger className="h-11 w-full rounded-xl border-[#ded9cf] bg-white font-semibold shadow-none"><SelectValue /></SelectTrigger><SelectContent>{items.map(([key, text]) => <SelectItem key={key} value={key}>{text}</SelectItem>)}</SelectContent></Select></label>;
}
function Pill({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return <button className="flex h-9 items-center gap-1.5 rounded-xl border border-[#e2ddd3] bg-white px-3 text-[10px] font-bold text-[#616a7b] transition hover:border-[#f1a798]"><Icon className="h-3.5 w-3.5 text-[#e66752]" />{text}</button>;
}
function ModeProgress({ label, value, width, color }: { label: string; value: string; width: string; color: string }) {
  return <div><div className="mb-2 flex items-center justify-between text-[11px]"><span className="font-extrabold">{label}</span><span className="text-[#aeb9ca]">{value}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${color}`} style={{ width }} /></div></div>;
}
function ActivityCard({ activity, onLaunch }: { activity: Activity; onLaunch: () => void }) {
  const Icon = activity.icon;
  return <article className="group flex min-h-[210px] flex-col rounded-[24px] border border-[#e5e0d6] bg-[#fffefa] p-5 shadow-[0_7px_22px_rgba(33,43,65,.035)] transition hover:-translate-y-1 hover:border-[#d9d1c5] hover:shadow-[0_12px_28px_rgba(33,43,65,.08)]">
    <div className="flex items-start justify-between"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colors[activity.color]}`}><Icon className="h-5 w-5" /></span><Badge variant="outline" className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold ${modeStyle[activity.mode]}`}>{activity.mode}</Badge></div>
    <h4 className="mt-4 text-base font-black">{activity.title}</h4><p className="mt-1.5 flex-1 text-xs leading-5 text-[#747c8b]">{activity.description}</p>
    <div className="mt-4 flex items-center justify-between border-t border-[#eee9df] pt-3"><div className="flex items-center gap-3 text-[10px] font-bold text-[#8b919d]"><span className="flex items-center gap-1"><Clock3 className="h-3 w-3" />{activity.time}</span><span>{activity.format}</span></div><button onClick={onLaunch} className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f3efe7] text-[#4f596b] transition group-hover:bg-[#1d2b49] group-hover:text-white" aria-label={`Open ${activity.title}`}><ArrowRight className="h-3.5 w-3.5" /></button></div>
  </article>;
}

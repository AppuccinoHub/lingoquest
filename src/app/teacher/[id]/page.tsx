"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Copy, Gamepad2, Heart, Link2, Pencil, Printer, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MaterialCard, ModeBadge } from "@/components/material-card";
import { RubricTable } from "@/components/rubric-table";
import { MODES, getLanguage, getLevel, type Mode } from "@/lib/actfl";
import { CATEGORY_META, CATEGORY_ORDER, generateMaterials, materialToText } from "@/lib/generator";
import { encodeLessonForShare, findLesson } from "@/lib/storage";
import type { Lesson, MaterialCategory } from "@/lib/types";
import { useStored } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function LessonPage() {
  const params = useParams<{ id: string }>();
  const [lesson] = useStored(() => findLesson(params.id) ?? null, params.id);

  if (lesson === undefined) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (lesson === null) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Lesson not found</h1>
        <p className="text-muted-foreground">Lessons are stored on the device where they were created. If a colleague shared this link, ask them for the student link instead.</p>
        <Button render={<Link href="/teacher" />}>Back to studio</Button>
      </div>
    );
  }

  return <LessonView lesson={lesson} />;
}

type View = "all" | MaterialCategory | "rubric";

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function LessonView({ lesson }: { lesson: Lesson }) {
  const level = getLevel(lesson.level);
  const lang = getLanguage(lesson.languageId);
  const materials = useMemo(() => generateMaterials(lesson), [lesson]);
  const [view, setView] = useState<View>("all");
  const [mode, setMode] = useState<Mode | null>(null);
  const [lowStakes, setLowStakes] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return materials.filter((m) => {
      if (view !== "all" && view !== "rubric" && m.category !== view) return false;
      if (mode && !m.modes.includes(mode)) return false;
      if (lowStakes && !m.lowAnxiety) return false;
      if (q && !`${m.title} ${m.description} ${m.steps.join(" ")}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [materials, view, mode, lowStakes, query]);

  const counts = useMemo(() => {
    const c: Partial<Record<MaterialCategory, number>> = {};
    materials.forEach((m) => (c[m.category] = (c[m.category] ?? 0) + 1));
    return c;
  }, [materials]);

  async function copyAll() {
    try {
      const header = `${lesson.title}\n${lang.name} · ${level.label} · ${lesson.theme}\n\n`;
      await navigator.clipboard.writeText(header + filtered.map(materialToText).join("\n\n---\n\n"));
      toast.success(`Copied ${filtered.length} materials`);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }

  async function shareLink() {
    const url = `${window.location.origin}/play/import#${encodeLessonForShare(lesson)}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Student link copied. Share it on your LMS or project a QR code.");
    } catch {
      window.prompt("Copy this student link:", url);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Link href="/teacher" className="no-print inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All lessons
      </Link>

      <header className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {lang.flag} {lang.name}
            </Badge>
            <Badge variant="outline">{level.label}</Badge>
            <Badge variant="outline">{lesson.theme}</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
          {lesson.essentialQuestion && <p className="text-lg text-muted-foreground">{lesson.essentialQuestion}</p>}
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <Button variant="outline" onClick={shareLink}>
            <Link2 /> Copy student link
          </Button>
          <Button render={<Link href={`/play/${lesson.id}`} />} variant="outline"><Gamepad2 /> Open arcade</Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer /> Print
          </Button>
          {lesson.createdAt !== 0 && (
            <Button render={<Link href={`/teacher/${lesson.id}/edit`} />}><Pencil /> Edit</Button>
          )}
        </div>
      </header>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Can-Do goals</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {lesson.canDo.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-0.5 size-4 shrink-0 rounded border border-primary/40" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Vocabulary ({lesson.vocabulary.length})</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {lesson.vocabulary.map((v, i) => (
              <span key={i} className="rounded-md bg-muted px-2 py-1 text-xs" title={v.translation}>
                <span className="font-medium">{v.term}</span>
                {v.translation && <span className="text-muted-foreground"> · {v.translation}</span>}
              </span>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Model sentences & structures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {lesson.sentences.map((s, i) => (
              <p key={i}>{s}</p>
            ))}
            {lesson.structures.length > 0 && (
              <p className="pt-2 text-xs text-muted-foreground">Structures: {lesson.structures.join(" · ")}</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {materials.length} supplemental materials
            </h2>
            <p className="text-sm text-muted-foreground">Generated for {level.label}. Click any title for full steps, differentiation, and the Can-Do it targets.</p>
          </div>
          <div className="no-print flex gap-2">
            <Button variant="outline" size="sm" onClick={copyAll}>
              <Copy /> Copy {view === "all" ? "all" : "these"}
            </Button>
          </div>
        </div>

        <div className="no-print mt-4 space-y-3">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Material categories">
            <FilterPill active={view === "all"} onClick={() => setView("all")}>
              All ({materials.length})
            </FilterPill>
            {CATEGORY_ORDER.filter((c) => counts[c]).map((c) => (
              <FilterPill key={c} active={view === c} onClick={() => setView(c)}>
                {CATEGORY_META[c].label} ({counts[c]})
              </FilterPill>
            ))}
            <FilterPill active={view === "rubric"} onClick={() => setView("rubric")}>
              Speaking rubric
            </FilterPill>
          </div>

          {view !== "rubric" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Mode:</span>
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(mode === m.id ? null : m.id)}
                  className={cn("rounded-md border px-2 py-0.5 text-xs font-semibold transition-opacity", m.color, mode && mode !== m.id && "opacity-40")}
                >
                  {m.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setLowStakes(!lowStakes)}
                className={cn(
                  "flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors",
                  lowStakes
                    ? "border-emerald-300 bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                <Heart className="size-3" /> Low-stakes speaking only
              </button>
              <div className="relative ml-auto w-full sm:w-64">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search activities" className="pl-8" />
              </div>
            </div>
          )}
        </div>

        {view === "rubric" ? (
          <div className="mt-6">
            <RubricTable lesson={lesson} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            Nothing matches those filters. Try clearing the mode or search.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <MaterialCard key={m.id} material={m} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12 rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold">Mode balance</h3>
        <p className="text-sm text-muted-foreground">How the generated set spreads across the three modes of communication.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {MODES.map((m) => {
            const n = materials.filter((x) => x.modes.includes(m.id)).length;
            return (
              <div key={m.id} className="rounded-xl border border-border/70 p-4">
                <div className="flex items-center justify-between">
                  <ModeBadge mode={m.id} />
                  <span className="text-sm font-semibold">{n}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((n / materials.length) * 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

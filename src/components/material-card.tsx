"use client";

import Link from "next/link";
import { Clock, Copy, ExternalLink, Heart, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MODE_BY_ID } from "@/lib/actfl";
import { CATEGORY_META, materialToText } from "@/lib/generator";
import type { Material } from "@/lib/types";

export function ModeBadge({ mode }: { mode: keyof typeof MODE_BY_ID }) {
  const m = MODE_BY_ID[mode];
  return <span className={`rounded-md border px-1.5 py-0.5 text-[11px] font-semibold ${m.color}`}>{m.label}</span>;
}

async function copy(m: Material) {
  try {
    await navigator.clipboard.writeText(materialToText(m));
    toast.success("Copied to clipboard");
  } catch {
    toast.error("Could not copy. Select the text and copy manually.");
  }
}

export function MaterialCard({ material: m }: { material: Material }) {
  return (
    <Dialog>
      <Card className="print-break flex h-full flex-col transition-shadow hover:shadow-md">
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="text-[11px]">
              {CATEGORY_META[m.category].label}
            </Badge>
            {m.modes.map((mode) => (
              <ModeBadge key={mode} mode={mode} />
            ))}
            {m.lowAnxiety && (
              <span className="flex items-center gap-1 rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                <Heart className="size-3" /> Low-stakes
              </span>
            )}
          </div>
          <DialogTrigger className="text-left">
            <CardTitle className="text-base leading-snug hover:text-primary">{m.title}</CardTitle>
          </DialogTrigger>
          <CardDescription className="line-clamp-3">{m.description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" /> {m.minutes ? `${m.minutes} min` : "reference"}
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-3.5" /> {m.groupSize}
            </span>
          </span>
          <span className="no-print flex items-center gap-1">
            {m.arcadeHref ? (
              <Button render={<Link href={m.arcadeHref} />} size="xs" variant="outline">Open <ExternalLink /></Button>
            ) : (
              <DialogTrigger render={<Button size="xs" variant="outline" />}>View</DialogTrigger>
            )}
          </span>
        </CardContent>
      </Card>

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary">{CATEGORY_META[m.category].label}</Badge>
            {m.modes.map((mode) => (
              <ModeBadge key={mode} mode={mode} />
            ))}
            <span className="text-xs text-muted-foreground">
              · {m.minutes ? `${m.minutes} min` : "reference"} · {m.groupSize} · {m.skills.join(", ")}
            </span>
          </div>
          <DialogTitle className="text-xl">{m.title}</DialogTitle>
          <DialogDescription>{m.description}</DialogDescription>
        </DialogHeader>
        <ol className="space-y-2 text-sm">
          {m.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
              <span className="pt-0.5">{s}</span>
            </li>
          ))}
        </ol>
        {m.differentiation && (
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-semibold">Differentiation</p>
            <p className="text-muted-foreground">{m.differentiation}</p>
          </div>
        )}
        {m.tip && (
          <div className="rounded-lg border border-border bg-muted p-3 text-sm">
            <p className="font-semibold">Teacher tip</p>
            <p className="text-muted-foreground">{m.tip}</p>
          </div>
        )}
        <div className="rounded-lg border border-border p-3 text-sm">
          <p className="font-semibold">Can-Do alignment</p>
          <p className="text-muted-foreground">{m.canDo}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {m.arcadeHref && (
            <Button render={<Link href={m.arcadeHref} />} variant="outline">Open in arcade <ExternalLink /></Button>
          )}
          <Button onClick={() => copy(m)}>
            <Copy /> Copy as text
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

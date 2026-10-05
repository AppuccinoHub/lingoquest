import { RUBRIC_DOMAINS, getLevel } from "@/lib/actfl";
import type { Lesson } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RubricTable({ lesson }: { lesson: Lesson }) {
  const level = getLevel(lesson.level);
  const bands = ["Novice", "Intermediate", "Advanced"] as const;
  return (
    <div className="print-break overflow-x-auto rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold">Speaking performance rubric · {lesson.title}</h3>
        <p className="text-sm text-muted-foreground">
          Based on the ACTFL Performance Descriptors. The <span className="font-medium text-foreground">{level.band}</span> column is the target for this lesson ({level.label}); the
          columns either side show what approaching and exceeding look like.
        </p>
      </div>
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="bg-muted/60 text-left">
            <th className="p-3 font-semibold">Domain</th>
            {bands.map((b) => (
              <th key={b} className={cn("p-3 font-semibold", b === level.band && "bg-primary/10 text-primary")}>
                {b}
                {b === level.band && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground">target</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RUBRIC_DOMAINS.map((row) => (
            <tr key={row.domain} className="border-t border-border align-top">
              <td className="p-3 font-medium">{row.domain}</td>
              <td className={cn("p-3 text-muted-foreground", level.band === "Novice" && "bg-primary/5 text-foreground")}>{row.novice}</td>
              <td className={cn("p-3 text-muted-foreground", level.band === "Intermediate" && "bg-primary/5 text-foreground")}>{row.intermediate}</td>
              <td className={cn("p-3 text-muted-foreground", level.band === "Advanced" && "bg-primary/5 text-foreground")}>{row.advanced}</td>
            </tr>
          ))}
          <tr className="border-t border-border align-top">
            <td className="p-3 font-medium">Task completion</td>
            <td className="p-3 text-muted-foreground" colSpan={3}>
              Uses the lesson vocabulary ({lesson.vocabulary.slice(0, 5).map((v) => v.term).join(", ")}
              {lesson.vocabulary.length > 5 ? "…" : ""}) and structures ({lesson.structures.join("; ") || "from the lesson"}) to accomplish the task. Score 1 (not yet) · 2 (partially) · 3 (fully) · 4 (fully, with elaboration).
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

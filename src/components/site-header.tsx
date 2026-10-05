"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, GraduationCap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { XpPill } from "./xp-pill";

const NAV = [
  { href: "/teacher", label: "Teacher studio", icon: GraduationCap },
  { href: "/play", label: "Student arcade", icon: Gamepad2 },
];

export function SiteHeader() {
  const pathname = usePathname();
  const inArcade = pathname.startsWith("/play");
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-4" />
          </span>
          <span className="hidden sm:inline">LingoQuest</span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
          {inArcade && <XpPill />}
        </nav>
      </div>
    </header>
  );
}

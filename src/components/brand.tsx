"use client"

import Link from "next/link"
import { Pip } from "@/components/pip"

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-foreground">
      <Pip className="size-9" />
      <span className="font-display text-xl leading-none tracking-tight">CanDo Arcade</span>
    </Link>
  )
}

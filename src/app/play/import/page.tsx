"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { decodeSharedLesson, saveLesson } from "@/lib/storage";

export default function ImportLessonPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // The hash is only readable on the client, so the import has to run after mount.
    const encoded = window.location.hash.replace(/^#/, "");
    const lesson = encoded ? decodeSharedLesson(encoded) : null;
    if (lesson) {
      saveLesson(lesson);
      router.replace(`/play/${lesson.id}`);
      return;
    }
    const frame = requestAnimationFrame(() =>
      setError(encoded ? "This link could not be read. Ask your teacher to copy it again." : "This link is missing the lesson data."),
    );
    return () => cancelAnimationFrame(frame);
  }, [router]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      {error ? (
        <>
          <h1 className="text-2xl font-bold">Couldn&apos;t open that lesson</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button render={<Link href="/play" />}>Go to the arcade</Button>
        </>
      ) : (
        <>
          <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-muted-foreground">Loading your lesson…</p>
        </>
      )}
    </div>
  );
}

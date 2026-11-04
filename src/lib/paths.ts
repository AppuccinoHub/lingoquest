/** Routes for a lesson. The id is a query param so one static HTML file serves every lesson. */

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function withId(path: string, id: string): string {
  return `${path}?id=${encodeURIComponent(id)}`;
}

export function teacherLessonPath(id: string): string {
  return withId("/teacher/lesson", id);
}

export function teacherEditPath(id: string): string {
  return withId("/teacher/lesson/edit", id);
}

export function playLessonPath(id: string): string {
  return withId("/play/lesson", id);
}

export function playGamePath(id: string, game: string): string {
  return withId(`/play/lesson/${game}`, id);
}

/** Absolute student link. Includes the GitHub Pages project prefix when the site is built for it. */
export function studentImportUrl(origin: string, encoded: string): string {
  return `${origin}${BASE_PATH}/play/import/#${encoded}`;
}

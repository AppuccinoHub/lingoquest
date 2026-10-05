import { ArcadeView } from "@/components/arcade-view"

export default async function Page({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params
  return <ArcadeView lessonId={lessonId} />
}

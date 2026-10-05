import { PlayView } from "@/components/play-view"

export default async function Page({
  params,
}: {
  params: Promise<{ lessonId: string; materialId: string }>
}) {
  const { lessonId, materialId } = await params
  return <PlayView lessonId={lessonId} materialId={materialId} />
}

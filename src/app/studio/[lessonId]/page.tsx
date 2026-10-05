import { StudioView } from "@/components/studio-view"

export default async function Page({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params
  return <StudioView lessonId={lessonId} />
}

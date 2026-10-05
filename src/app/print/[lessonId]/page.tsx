import { PrintView } from "@/components/print-view"

export default async function Page({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params
  return <PrintView lessonId={lessonId} />
}

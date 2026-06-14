import { BackgroundPattern } from '@/components/background-pattern'
import { Header } from '@/components/header'
import { PaperBuilder } from '@/components/paper/paper-builder'

export const metadata = {
  title: 'Create Question Paper | AutoPaper',
  description: 'Generate and print a curriculum-aligned A4 question paper.',
}

export default function CreatePaperPage() {
  return (
    <main className="site-shell relative min-h-screen overflow-x-hidden bg-background">
      <BackgroundPattern />
      <Header />
      <PaperBuilder />
    </main>
  )
}

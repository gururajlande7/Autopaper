import { redirect } from 'next/navigation'
import { BackgroundPattern } from '@/components/background-pattern'
import { Header } from '@/components/header'
import { PaperBuilder } from '@/components/paper/paper-builder'
import { getCurrentUser } from '@/lib/server/auth'

export const metadata = {
  title: 'Create Question Paper | AutoPaper',
  description: 'Generate and print a curriculum-aligned A4 question paper.',
}

export const dynamic = 'force-dynamic'

export default async function CreatePaperPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?next=/create')
  }

  return (
    <main className="site-shell relative min-h-screen overflow-x-hidden bg-background">
      <BackgroundPattern />
      <Header />
      <PaperBuilder />
    </main>
  )
}

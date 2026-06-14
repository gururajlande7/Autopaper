import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-primary">
          404
        </p>
        <h1 className="mt-2 text-4xl font-bold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          The page you requested does not exist.
        </p>
        <Link
          className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 font-semibold text-white"
          href="/"
        >
          Return home
        </Link>
      </div>
    </main>
  )
}

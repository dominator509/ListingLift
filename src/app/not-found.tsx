import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Page not found</p>
        <nav className="mt-8 flex flex-wrap justify-center gap-4" aria-label="404 navigation">
          <Link
            href="/"
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/search"
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Search
          </Link>
        </nav>
      </div>
    </div>
  );
}

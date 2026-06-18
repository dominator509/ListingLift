'use client';

import { PublicShell } from '@/components/layout/public-shell';

export default function UploadTokenError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <PublicShell>
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-800">Upload link error</h1>
          <p className="mt-4 text-red-600">This upload link could not be loaded. The token may be invalid or expired.</p>
          <button
            onClick={reset}
            className="mt-6 rounded-md bg-red-700 px-6 py-2 text-white hover:bg-red-800"
          >
            Try again
          </button>
        </div>
      </section>
    </PublicShell>
  );
}

'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          next: searchParams.get('next') || '/admin',
        }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string; next?: string };

      if (!response.ok || !result.ok) {
        setError(result.error || 'Unable to sign in.');
        return;
      }

      router.replace(result.next || '/admin');
      router.refresh();
    } catch {
      setError('Unable to sign in right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-16 text-zinc-950">
      <div className="mx-auto flex max-w-sm flex-col gap-6">
        <div>
          <span className="flex size-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-800 shadow-sm">
            <LockKeyhole className="size-5" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Admin dashboard</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Sign in to view private analytics for grid conversions and feedback.
          </p>
        </div>

        <form onSubmit={submit} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <label className="block text-sm font-medium text-zinc-800" htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            autoComplete="current-password"
            required
          />
          {error && (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <Button type="submit" className="mt-4 w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </main>
  );
}

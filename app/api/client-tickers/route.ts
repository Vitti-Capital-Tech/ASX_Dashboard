import { NextResponse } from 'next/server';

/**
 * The ASX codes the firm's clients hold, read from the client dashboard.
 *
 * The mirror of `lib/asx/news.ts` in that project, which reads this one's
 * `/api/market-sensitive`. Same shape of contract: a sibling deployment over
 * HTTP, a shared secret, and a failure that costs one section rather than the
 * route.
 *
 * ── Why a proxy and not a fetch from the browser ───────────────────────────
 * The secret. A client-side fetch would have to ship it to every visitor, and
 * `NEXT_PUBLIC_` on a key that reads the firm's book is not a thing to do. The
 * browser calls this route; this route holds the credential.
 *
 * ── Failure is an empty list, and the caller must say so ───────────────────
 * `ok: false` rather than an error status, because the page has something
 * useful to do with it: show "holdings unavailable" instead of the day's
 * unfiltered feed. An empty list and a broken link look identical otherwise,
 * and the second one silently claims no client holds anything in the news.
 */

export const dynamic = 'force-dynamic';

interface Payload {
  ok: boolean;
  codes: string[];
  count: number;
  /** When the client dashboard built the list, not when we asked for it. */
  generated_at: string | null;
  /** Why it is empty, for the banner. Null when the read succeeded. */
  error: string | null;
}

const EMPTY = (error: string): Payload => ({
  ok: false, codes: [], count: 0, generated_at: null, error,
});

export async function GET() {
  const base = process.env.CLIENT_DASHBOARD_URL?.trim().replace(/\/+$/, '');
  const key = process.env.CLIENT_DASHBOARD_API_KEY?.trim();

  if (!base || !key) {
    return NextResponse.json(
      EMPTY('CLIENT_DASHBOARD_URL and CLIENT_DASHBOARD_API_KEY are not set'),
    );
  }

  try {
    const res = await fetch(`${base}/api/holdings/codes`, {
      headers: { authorization: `Bearer ${key}` },
      cache: 'no-store',
      // The client dashboard reads Supabase to answer this. If it cannot do
      // that promptly, the tab should say so rather than hang the page.
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      return NextResponse.json(EMPTY(
        res.status === 401
          ? 'Rejected by the client dashboard — check the shared key'
          : `Client dashboard returned ${res.status}`,
      ));
    }

    const data = await res.json();
    // Trust nothing about the shape: this crosses a deployment boundary, and a
    // malformed payload should empty the tab, not throw inside the page.
    const codes = Array.isArray(data?.codes)
      ? Array.from(new Set<string>(
          data.codes
            .filter((c: unknown): c is string => typeof c === 'string')
            .map((c: string) => c.trim().toUpperCase())
            .filter(Boolean),
        )).sort()
      : [];

    return NextResponse.json({
      ok: true,
      codes,
      count: codes.length,
      generated_at: typeof data?.generated_at === 'string' ? data.generated_at : null,
      error: null,
    } satisfies Payload);
  } catch (e) {
    const timedOut = e instanceof Error && e.name === 'TimeoutError';
    return NextResponse.json(EMPTY(
      timedOut ? 'Client dashboard did not respond in time' : 'Client dashboard unreachable',
    ));
  }
}

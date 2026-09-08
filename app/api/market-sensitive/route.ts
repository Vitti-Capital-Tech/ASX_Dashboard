import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import type { Announcement, DayLog, SentimentLabel } from '@/types';

/**
 * Market-sensitive announcements, for consumption by other dashboards.
 *
 * /api/logs/<date> already serves a day, but it returns all ~400 announcements
 * of it — a consumer that only wants the price-sensitive ~50 would download and
 * discard 90% of the payload, and would have to re-implement the filter. This
 * endpoint is the contract instead: one flat, stable shape, filtered server
 * side, with the fields a feed needs and nothing else.
 *
 * GET /api/market-sensitive
 *   ?date=YYYY-MM-DD   a single trading day (default: the most recent day held)
 *   ?days=N            the N most recent trading days, newest first (1-30)
 *   ?sentiment=        bullish | bearish | neutral
 *   ?since=<ISO>       only announcements released after this instant
 *   ?limit=N           cap on items returned (default 200, max 1000)
 *
 * Built for polling. fetch_asx.py rewrites today's log every ~5 minutes through
 * the Sydney morning and hourly until early afternoon — 17 times on 4 Sept — so
 * a consumer following the day has to re-read it repeatedly. Three things make
 * that cheap and safe:
 *
 *   1. `id` is the ASX document id and never changes, so a consumer upserts
 *      rather than inserts and a re-poll cannot duplicate anything.
 *   2. `since` returns only what is newer than what the caller already holds.
 *   3. An ETag over each day's `generated_at` and count means an unchanged
 *      feed answers If-None-Match with a bodyless 304.
 *
 * save_log() merges and deduplicates rather than overwriting, so a day's items
 * only ever accumulate — nothing a consumer has already seen disappears later.
 *
 * Response is the same shape whether one day or thirty, so a consumer never
 * branches on it: { from, to, count, truncated, items: [...] }, each item
 * carrying its own `date`.
 */

// Read from disk per request. The daily job commits a new log file; a
// prerendered response would serve yesterday's until the next deploy.
export const dynamic = 'force-dynamic';

const DEFAULT_LIMIT = 200;
const MAX_LIMIT = 1000;
const MAX_DAYS = 30;
const SENTIMENTS: SentimentLabel[] = ['bullish', 'bearish', 'neutral'];

interface NewsItem {
  /** Stable per announcement — the ASX document id, safe to upsert on. */
  id: string;
  date: string;
  ticker: string;
  company: string;
  headline: string;
  /** The hyperlink: the announcement PDF on the ASX platform. */
  url: string;
  released_at: string;
  sentiment: SentimentLabel;
  document_type: string;
  tags: string[];
  summary: string[];
}

/** The trailing path segment of an ASX document URL is its unique id. */
function announcementId(ann: Announcement): string {
  const tail = (ann.url || '').split('/').filter(Boolean).pop();
  return tail || `${ann.ticker}-${ann.time}`;
}

function toItem(ann: Announcement, date: string): NewsItem {
  return {
    id: announcementId(ann),
    date,
    ticker: ann.ticker,
    company: ann.company,
    headline: ann.headline,
    url: ann.url,
    released_at: ann.time,
    // Older logs predate the model writing a sentiment; the UI infers one for
    // display, but an API should not guess — it says neutral and means it.
    sentiment: ann.sentiment ?? 'neutral',
    document_type: ann.document_type,
    tags: ann.tags ?? [],
    summary: ann.summary ?? [],
  };
}

async function availableDates(logsDir: string): Promise<string[]> {
  const files = await readdir(logsDir);
  return files
    .filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map(f => f.replace('.json', ''))
    .sort()
    .reverse(); // newest first
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // A shared secret only if one is configured, matching the existing public
  // read endpoints. Set ASX_API_KEY to close this off.
  const required = (process.env.ASX_API_KEY || '').trim();
  if (required) {
    const supplied = request.headers.get('x-api-key')
      || (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (supplied !== required) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const dateParam = searchParams.get('date');
  if (dateParam && !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return NextResponse.json(
      { error: `Invalid date: ${dateParam}. Expected YYYY-MM-DD.` }, { status: 400 });
  }

  const sentiment = searchParams.get('sentiment');
  if (sentiment && !SENTIMENTS.includes(sentiment as SentimentLabel)) {
    return NextResponse.json(
      { error: `Invalid sentiment: ${sentiment}. Expected one of ${SENTIMENTS.join(', ')}.` },
      { status: 400 });
  }

  const sinceParam = searchParams.get('since');
  let sinceMs: number | null = null;
  if (sinceParam) {
    sinceMs = Date.parse(sinceParam);
    if (Number.isNaN(sinceMs)) {
      return NextResponse.json(
        { error: `Invalid since: ${sinceParam}. Expected an ISO 8601 instant.` }, { status: 400 });
    }
  }

  const days = Math.min(Math.max(parseInt(searchParams.get('days') || '1', 10) || 1, 1), MAX_DAYS);
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);

  const logsDir = path.join(process.cwd(), 'logs');

  let dates: string[];
  try {
    const all = await availableDates(logsDir);
    if (dateParam) {
      if (!all.includes(dateParam)) {
        return NextResponse.json(
          { error: `No data for ${dateParam}.`, available_from: all.at(-1), available_to: all[0] },
          { status: 404 });
      }
      dates = [dateParam];
    } else {
      dates = all.slice(0, days);
    }
  } catch {
    return NextResponse.json({ error: 'No logs available.' }, { status: 503 });
  }

  if (dates.length === 0) {
    return NextResponse.json({ from: null, to: null, count: 0, truncated: false, items: [] });
  }

  const items: NewsItem[] = [];
  const fingerprint: string[] = [];
  let truncated = false;

  for (const date of dates) {
    let log: DayLog;
    try {
      log = JSON.parse(await readFile(path.join(logsDir, `${date}.json`), 'utf-8'));
    } catch {
      continue; // a missing or corrupt day should not fail the whole range
    }

    // generated_at moves on every fetch run and total moves whenever an
    // announcement is added, so together they change exactly when the day does.
    fingerprint.push(`${date}:${log.generated_at}:${log.total}`);

    const matching = (log.announcements ?? [])
      .filter(a => a.market_sensitive)
      .filter(a => !sentiment || (a.sentiment ?? 'neutral') === sentiment)
      .filter(a => sinceMs === null || Date.parse(a.time) > sinceMs)
      // Newest first within the day, so a range reads strictly newest-first.
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    for (const ann of matching) {
      if (items.length >= limit) { truncated = true; break; }
      items.push(toItem(ann, date));
    }
    if (truncated) break;
  }

  // The query is part of the tag: the same data filtered two ways is not the
  // same response, and must not collide in a cache.
  const etag = `W/"${Buffer.from(
    `${fingerprint.join('|')}|${sentiment ?? ''}|${sinceParam ?? ''}|${limit}`
  ).toString('base64url').slice(0, 40)}"`;

  if (request.headers.get('if-none-match') === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: { ETag: etag, 'Cache-Control': 'public, max-age=30, must-revalidate' },
    });
  }

  return NextResponse.json(
    {
      from: dates.at(-1),
      to: dates[0],
      count: items.length,
      truncated,
      /** Pass back as ?since= on the next poll to get only what is newer. */
      latest_released_at: items[0]?.released_at ?? null,
      items,
    },
    {
      headers: {
        ETag: etag,
        // Short max-age absorbs a burst; must-revalidate means a poller past
        // that window gets a 304 rather than a stale body.
        'Cache-Control': 'public, max-age=30, must-revalidate',
      },
    }
  );
}

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// Read from disk on every request. Without this Next prerenders the response at
// build time, so a scorecard committed by the nightly job would not appear until
// the whole app was rebuilt — and a consumer polling this endpoint would be
// served stale numbers with no error to tell them so.
export const dynamic = 'force-dynamic';

/**
 * Rolling all-time accuracy. This is the endpoint downstream consumers
 * (LinkedIn content generation, other projects) should poll — it is a small,
 * stable payload with no per-announcement rows.
 */
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'scorecard', 'summary.json');
    const content = await readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json(
        { error: 'No summary yet. Run verify_sentiment.py after an ASX close.' },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: 'Failed to read summary' }, { status: 500 });
  }
}

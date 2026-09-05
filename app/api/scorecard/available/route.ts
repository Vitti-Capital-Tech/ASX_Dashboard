import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

// Read from disk on every request. Without this Next prerenders the response at
// build time, so a scorecard committed by the nightly job would not appear until
// the whole app was rebuilt — and a consumer polling this endpoint would be
// served stale numbers with no error to tell them so.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'scorecard');
    const files = await readdir(dir);
    const dates = files
      .filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)) // excludes summary.json
      .map(f => f.replace('.json', ''))
      .sort()
      .reverse(); // newest first
    return NextResponse.json({ dates });
  } catch {
    return NextResponse.json({ dates: [] });
  }
}

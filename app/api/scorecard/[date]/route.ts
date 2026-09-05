import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  const { date } = params;

  // Validate date format YYYY-MM-DD strictly
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: `Invalid date format: ${date}` }, { status: 400 });
  }

  // Extra sanity: year must be reasonable
  const year = parseInt(date.slice(0, 4));
  if (year < 2020 || year > 2100) {
    return NextResponse.json({ error: `Invalid year in date: ${date}` }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'scorecard', `${date}.json`);
    const content = await readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(content));
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json(
        {
          error: `No scorecard for ${date}. It is written after the ASX close — run verify_sentiment.py.`,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: 'Failed to read scorecard' }, { status: 500 });
  }
}

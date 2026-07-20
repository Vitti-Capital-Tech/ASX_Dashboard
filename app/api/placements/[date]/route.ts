import { NextResponse } from 'next/server';
import { marketApi } from '@/lib/markets';

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  const { date } = params;
  const region = new URL(request.url).searchParams.get('region');

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: `Invalid date format: ${date}` }, { status: 400 });
  }

  try {
    const res = await fetch(`${marketApi(region)}/api/placements/${date}`, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: `No placement data found for ${date}.` }, { status: 404 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to connect to placement API' }, { status: 502 });
  }
}

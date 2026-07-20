import { NextResponse } from 'next/server';
import { marketApi } from '@/lib/markets';

export async function GET(request: Request) {
  const region = new URL(request.url).searchParams.get('region');
  try {
    const res = await fetch(`${marketApi(region)}/api/placements`, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json([]);
    const data = await res.json();
    return NextResponse.json(data.dates || []);
  } catch {
    return NextResponse.json([]);
  }
}

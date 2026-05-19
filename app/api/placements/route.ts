import { NextResponse } from 'next/server';

const EC2_API = 'http://3.25.70.124:8000';

export async function GET() {
  try {
    const res = await fetch(`${EC2_API}/api/placements`, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json([]);
    const data = await res.json();
    return NextResponse.json(data.dates || []);
  } catch {
    return NextResponse.json([]);
  }
}
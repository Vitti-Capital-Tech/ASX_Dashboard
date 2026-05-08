import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const placementsDir = path.join(process.cwd(), 'placements');

    if (!fs.existsSync(placementsDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(placementsDir);
    const dates = files
      .filter(f => f.endsWith('.json') && /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map(f => f.replace('.json', ''))
      .sort((a, b) => b.localeCompare(a));

    return NextResponse.json(dates);
  } catch (error) {
    console.error('Error scanning placements directory:', error);
    return NextResponse.json([], { status: 500 });
  }
}

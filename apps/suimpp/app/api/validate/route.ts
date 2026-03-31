import { NextRequest, NextResponse } from 'next/server';
import { check } from '@suimpp/discovery';
import type { CheckResult } from '@suimpp/discovery';

export async function POST(request: NextRequest) {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.url || typeof body.url !== 'string') {
    return NextResponse.json(
      { error: 'Missing required field: url' },
      { status: 400 },
    );
  }

  const url = body.url.startsWith('http') ? body.url : `https://${body.url}`;

  let result: CheckResult;
  try {
    result = await check(url);
  } catch (err) {
    return NextResponse.json(
      { error: `Validation failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    );
  }

  return NextResponse.json(result);
}

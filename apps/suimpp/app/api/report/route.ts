import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface ReportPayload {
  digest: string;
  sender?: string;
  recipient?: string;
  amount: string;
  currency?: string;
  network?: string;
  serverUrl?: string;
  service?: string;
  endpoint?: string;
}

export async function POST(request: NextRequest) {
  let body: ReportPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.digest || !body.amount) {
    return NextResponse.json(
      { error: 'Missing required fields: digest, amount' },
      { status: 400 },
    );
  }

  const existing = body.digest
    ? await db.payment.findUnique({ where: { digest: body.digest } })
    : null;
  if (existing) {
    if (body.service || body.endpoint) {
      await db.payment.update({
        where: { id: existing.id },
        data: {
          ...(body.service ? { service: body.service } : {}),
          ...(body.endpoint ? { endpoint: body.endpoint } : {}),
          ...(body.sender && !existing.sender ? { sender: body.sender } : {}),
        },
      });
    }
    return NextResponse.json({ ok: true, id: existing.id, enriched: true });
  }

  let serverId: number | null = null;

  if (body.serverUrl) {
    const server = await db.server.findUnique({
      where: { url: body.serverUrl },
    });
    if (server) {
      serverId = server.id;
    }
  }

  if (!serverId && body.recipient) {
    const server = await db.server.findFirst({
      where: { recipient: body.recipient },
    });
    if (server) {
      serverId = server.id;
    }
  }

  if (!serverId) {
    return NextResponse.json(
      { error: 'Unknown server — register at suimpp.dev first' },
      { status: 404 },
    );
  }

  const payment = await db.payment.create({
    data: {
      serverId,
      digest: body.digest,
      sender: body.sender,
      recipient: body.recipient,
      amount: body.amount,
      currency: body.currency,
      network: body.network ?? 'mainnet',
      service: body.service ?? '',
      endpoint: body.endpoint ?? '',
    },
  });

  return NextResponse.json({ ok: true, id: payment.id });
}

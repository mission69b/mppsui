import { NextRequest, NextResponse } from 'next/server';
import { check } from '@suimpp/discovery';
import { db } from '@/lib/db';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function extractCategories(
  endpoints: { paymentInfo: { description?: string }; summary?: string; path: string }[],
): string {
  const tags = new Set<string>();
  for (const ep of endpoints) {
    const text = `${ep.summary ?? ''} ${ep.paymentInfo.description ?? ''} ${ep.path}`;
    const lower = text.toLowerCase();
    if (/ai|chat|complet|llm|generat/i.test(lower)) tags.add('AI');
    if (/search|query/i.test(lower)) tags.add('Search');
    if (/image|stability|dalle/i.test(lower)) tags.add('Images');
    if (/mail|postcard|letter|lob/i.test(lower)) tags.add('Physical Mail');
    if (/commerce|shop|product/i.test(lower)) tags.add('Commerce');
    if (/defi|swap|stake|pool/i.test(lower)) tags.add('DeFi');
    if (/finance|rate|forex|price/i.test(lower)) tags.add('Finance');
    if (/translate|transcri/i.test(lower)) tags.add('Language');
    if (/code|github|git/i.test(lower)) tags.add('Code');
  }
  return Array.from(tags).slice(0, 5).join(', ');
}

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

  const existing = await db.server.findUnique({ where: { url } });
  if (existing) {
    return NextResponse.json(
      { error: 'Server already registered', slug: existing.slug },
      { status: 409 },
    );
  }

  const result = await check(url);
  if (!result.ok) {
    return NextResponse.json(
      { error: 'Validation failed — fix all errors before registering', result },
      { status: 422 },
    );
  }

  const name = result.discovery.title;
  let slug = slugify(name);

  const slugExists = await db.server.findUnique({ where: { slug } });
  if (slugExists) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const categories = extractCategories(result.discovery.endpoints);

  const endpointData = result.discovery.endpoints.map((ep) => ({
    path: ep.path,
    method: ep.method,
    summary: ep.summary ?? null,
    price: ep.paymentInfo.price ?? ep.paymentInfo.amount ?? null,
    pricingMode: ep.paymentInfo.pricingMode ?? 'fixed',
  }));

  const server = await db.server.create({
    data: {
      name,
      slug,
      url,
      openapiUrl: result.discovery.specUrl,
      description: result.discovery.guidance ?? null,
      recipient: result.probe?.recipient ?? null,
      verified: true,
      status: 'active',
      services: 0,
      endpoints: result.discovery.paidEndpoints,
      categories,
      endpointData: JSON.stringify(endpointData),
    },
  });

  return NextResponse.json({
    ok: true,
    id: server.id,
    slug: server.slug,
  });
}

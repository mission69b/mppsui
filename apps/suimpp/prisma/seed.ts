import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  let endpointData = '[]';
  try {
    const res = await fetch('https://mpp.t2000.ai/openapi.json');
    if (res.ok) {
      const doc = await res.json();
      const endpoints: { path: string; method: string; summary: string | null; price: string | null; pricingMode: string }[] = [];
      for (const [path, methods] of Object.entries(doc.paths ?? {})) {
        for (const [method, op] of Object.entries(methods as Record<string, Record<string, unknown>>)) {
          if (method === 'parameters' || method === 'servers') continue;
          const pi = (op as Record<string, Record<string, string>>)['x-payment-info'];
          if (pi) {
            endpoints.push({
              path,
              method: method.toUpperCase(),
              summary: (op.summary as string) ?? null,
              price: pi.price ?? pi.amount ?? null,
              pricingMode: pi.pricingMode ?? 'fixed',
            });
          }
        }
      }
      endpointData = JSON.stringify(endpoints);
      console.log(`  Fetched ${endpoints.length} endpoints from OpenAPI`);
    }
  } catch (e) {
    console.warn('  Could not fetch OpenAPI for endpoint data:', e);
  }

  const server = await prisma.server.upsert({
    where: { url: 'https://mpp.t2000.ai' },
    update: {
      slug: 't2000-gateway',
      services: 40,
      endpoints: 88,
      categories: 'AI, Search, Commerce, Physical Mail, DeFi',
      description: '40 AI and utility services for agents — OpenAI, Anthropic, Brave, Stability, Lob, and more.',
      recipient: '0x76d70cf9d3ab7f714a35adf8766a2cb25929cae92ab4de54ff4dea0482b05012',
      endpointData,
    },
    create: {
      name: 't2000 Gateway',
      slug: 't2000-gateway',
      url: 'https://mpp.t2000.ai',
      openapiUrl: 'https://mpp.t2000.ai/openapi.json',
      verified: true,
      services: 40,
      endpoints: 88,
      categories: 'AI, Search, Commerce, Physical Mail, DeFi',
      description: '40 AI and utility services for agents — OpenAI, Anthropic, Brave, Stability, Lob, and more.',
      recipient: '0x76d70cf9d3ab7f714a35adf8766a2cb25929cae92ab4de54ff4dea0482b05012',
      endpointData,
    },
  });

  console.log(`Seeded server: ${server.name} (id: ${server.id})`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

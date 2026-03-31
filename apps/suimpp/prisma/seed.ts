import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const server = await prisma.server.upsert({
    where: { url: 'https://mpp.t2000.ai' },
    update: {
      services: 40,
      endpoints: 88,
    },
    create: {
      name: 't2000 Gateway',
      url: 'https://mpp.t2000.ai',
      openapiUrl: 'https://mpp.t2000.ai/openapi.json',
      verified: true,
      services: 40,
      endpoints: 88,
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

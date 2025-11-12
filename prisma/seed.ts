import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

const lifecycleNames = [
  'requested',
  'delivered',
  'completed',
  'cancelled_by_client',
  'cancelled_by_freelancer',
  'disputed',
  'refunded',
  'rejected_on_request',
  'payment_pending',
  'payment_approved',
  'payment_failed',
  'transaction_timeout',
  'on_review'
];

const categoryData = [
  { name: 'edicion', description: 'Trabajos relacionados a edicion de fotos y videos' },
  { name: 'medicina online', description: 'Trabajos relacionados a consultas de salud online' },
  { name: 'arte', description: 'Trabajos relacionados creacion de arte personalizado' },
  { name: 'marketing', description: 'Promociona lo que quieras con anuncios online' },
];


async function main() {
  console.log('Seeding data...');

  console.log('Truncating and seeding Lifecycles...');
  await prisma.$executeRaw`TRUNCATE "Lifecycle" RESTART IDENTITY CASCADE;`;
  await prisma.lifecycle.createMany({
    data: lifecycleNames.map(name => ({ name: name })),
  });
  console.log(`Successfully seeded ${lifecycleNames.length} lifecycles.`);

  console.log('Truncating and seeding Categories...');
  await prisma.$executeRaw`TRUNCATE "Category" RESTART IDENTITY CASCADE;`;
  await prisma.category.createMany({
    data: categoryData,
  });
  console.log(`Successfully seeded ${categoryData.length} categories.`);

  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
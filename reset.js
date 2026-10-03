const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetDb() {
  await prisma.foodOrder.deleteMany();
  await prisma.order.deleteMany();
  console.log('Database has been reset successfully!');
}

resetDb()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || 'DLTT2027';
  const password = process.env.ADMIN_PASSWORD || 'dongband2025@';

  const existingAdmin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    console.log(`Admin user created with username: ${username}`);
  } else {
    console.log(`Admin user ${username} already exists.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

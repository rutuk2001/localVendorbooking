import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password@123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@lvb.com' },
    update: {},
    create: {
      name: 'Platform Admin',
      email: 'admin@lvb.com',
      password: passwordHash,
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });

  const categories = ['Cleaning', 'Plumbing', 'Electrical', 'Salon & Spa', 'Appliance Repair', 'Painting'];
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug, description: `${name} services near you` },
    });
  }

  console.log('Seed complete. Admin login: admin@lvb.com / Password@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import { seedSkinTypes } from './skin-type.seed';
import { seedUsers } from './user.seed';
import { seedProducts } from './product.seed';
import { seedProductCombos } from './combo.seed';
import { seedRoutinePackages } from './routine-package.seed';
import { seedRoutineInstructions } from './product_usage_instructions.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  await seedUsers(prisma);
  console.log('✅ Users seeded');

  await seedSkinTypes(prisma);
  console.log('✅ Skin types seeded.');

  await seedProducts(prisma);
  console.log('✅ Products seeded.');

  await seedProductCombos(prisma);
  console.log('✅ Product combos seeded.');

  await seedRoutinePackages(prisma);
  console.log('✅ Routine packages seeded.');

  await seedRoutineInstructions(prisma);
  console.log('✅ Product usage instructions seeded.');
}

main().finally(async () => {
  await prisma.$disconnect();
});

import { PrismaClient, skin_type_enum } from '@prisma/client';

export async function seedSkinTypes(prisma: PrismaClient) {
  await prisma.skin_types.createMany({
    data: [
      { code: skin_type_enum.NORMAL },
      { code: skin_type_enum.DRY },
      { code: skin_type_enum.COMBINATION },
      { code: skin_type_enum.SENSITIVE },
      { code: skin_type_enum.OILY },
    ],
    skipDuplicates: true,
  });
}

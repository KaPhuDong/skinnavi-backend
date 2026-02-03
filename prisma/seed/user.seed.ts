import { PrismaClient, user_role_enum } from '@prisma/client';
import bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('password', saltRounds);

  await prisma.users.createMany({
    data: [
      {
        email: 'admin.skinnavi@gmail.com',
        password_hash: hashedPassword,
        full_name: 'Admin',
        role: user_role_enum.ADMIN,
      },
      {
        email: 'skinnavier.skinnavi@gmail.com',
        password_hash: hashedPassword,
        full_name: 'SkinNavier',
        role: user_role_enum.USER,
      },
    ],
    skipDuplicates: true,
  });
}

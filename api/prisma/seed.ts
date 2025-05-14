import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {

  const categories = [
    { name: "Nutricionista" },
    { name: "Personal Trainer" },
    { name: "Manicure" },
    { name: "Psicologo" },

  ];

  for (let categorie of categories) {
    await prisma.category.create({
      data: {
        id: randomUUID(),
        name: categorie.name
      },
    });
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

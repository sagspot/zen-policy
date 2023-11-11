import { PrismaClient, Role } from '@prisma/client';

type User = { name: string; email: string; role: Role };

const prisma = new PrismaClient();

const data: User[] = [
  {
    name: 'John Doe',
    email: 'jdoe@mail.com',
    role: 'superadmin',
  },
  {
    name: 'Jane Dee',
    email: 'janedee@mail.com',
    role: 'admin',
  },
  {
    name: 'Jack Dan',
    email: 'jackdan@mail.com',
    role: 'customer',
  },
  {
    name: 'May Dee',
    email: 'maydee@mail.com',
    role: 'customer',
  },
  {
    name: 'June Doe',
    email: 'junedoe@mail.com',
    role: 'customer',
  },
];

async function main() {
  await prisma.user.createMany({ data });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

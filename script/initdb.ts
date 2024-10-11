const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const themkh = await prisma.user.create({
    data:{
        masv:"123569",
        name:"Admin",
        password:"123456789",
        role:"admin"
    }
  })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

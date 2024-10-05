const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const themkh = await prisma.user.create({
    data:{
        masv:"21004148",
        name:"Nguyễn Châu Hoàng Thái",
        password:"123456789",
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

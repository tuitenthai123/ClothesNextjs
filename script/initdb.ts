const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Tìm kiếm tất cả các ghi danh dựa trên `masv` của sinh viên
  const response = await prisma.ghidanh.findMany({
    where: {
      khoahoc: {
        id_khoa: "cVKtIf" // Điều kiện tìm kiếm mã số sinh viên
      },
    },
    include: {
      user: true, // Lấy thêm thông tin từ bảng `User`
      khoahoc: true // Lấy thêm thông tin từ bảng `Khoahoc`
    }
  });

  console.log(response);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

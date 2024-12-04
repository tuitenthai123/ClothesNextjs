const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // // Tìm kiếm tất cả các ghi danh dựa trên `masv` của sinh viên
  // const response = await prisma.ghidanh.findMany({
  //   where: {
  //     khoahoc: {
  //       id_khoa: "cVKtIf" // Điều kiện tìm kiếm mã số sinh viên
  //     },
  //   },
  //   include: {
  //     user: true, // Lấy thêm thông tin từ bảng `User`
  //     khoahoc: true // Lấy thêm thông tin từ bảng `Khoahoc`
  //   }
  // });
  const response = await prisma.kehoach.create({
    data: {
      userId:"21004102",
      items:{
        "A": [
            "A1",
            "A2",
            "A3"
        ],
        "B": [
            "B1",
            "B2",
            "B3"
        ],
        "C": [
            "C1",
            "C2",
            "C3"
        ],
        "D": [
            "D1",
            "D2",
            "D3"
        ],
        "E": [
            "E1",
            "E2",
            "E3"
        ],
        "F": [
            "F1",
            "F2",
            "F3"
        ],
        "G": [
            "G1",
            "G2",
            "G3"
        ]},
      value:{
        "A1": {
          sotiethoc: "Tiết học A1",
          sotinhchi: "Tín chỉ A1",
          tenhocphan: "Học phần A1"
        },
        "A2": {
          sotiethoc: "Tiết học A2",
          sotinhchi: "Tín chỉ A2",
          tenhocphan: "Học phần A2"
        },
        "A3": {
          sotiethoc: "Tiết học A3",
          sotinhchi: "Tín chỉ A3",
          tenhocphan: "Học phần A3"
        },
        "B1": {
          sotiethoc: "Tiết học B1",
          sotinhchi: "Tín chỉ B1",
          tenhocphan: "Học phần B1"
        },
        "B2": {
          sotiethoc: "Tiết học B2",
          sotinhchi: "Tín chỉ B2",
          tenhocphan: "Học phần B2"
        },
        "B3": {
          sotiethoc: "Tiết học B3",
          sotinhchi: "Tín chỉ B3",
          tenhocphan: "Học phần B3"
        },
        "F1": {
          sotiethoc: "Tiết học F1",
          sotinhchi: "Tín chỉ F1",
          tenhocphan: "Học phần F1"
        },
        "F2": {
          sotiethoc: "Tiết học F2",
          sotinhchi: "Tín chỉ F2",
          tenhocphan: "Học phần F2"
        },
        "F3": {
          sotiethoc: "Tiết học F3",
          sotinhchi: "Tín chỉ F3",
          tenhocphan: "Học phần F3"
        },
      }
    },
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

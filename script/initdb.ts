const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const courseData = [
  {
    "tenmon": "Triết học Mác - Lênin",
    "mamon": "CT2101",
    "sotinhchi": 3
  },
  {
    "tenmon": "Kinh tế CT Mác - Lênin",
    "mamon": "CT2102",
    "sotinhchi": 2
  },
  {
    "tenmon": "CNXH khoa học",
    "mamon": "CT2103",
    "sotinhchi": 2
  },
  {
    "tenmon": "Lịch sử Đảng CSVN",
    "mamon": "CT2104",
    "sotinhchi": 2
  },
  {
    "tenmon": "Tư tưởng HCM",
    "mamon": "CT1102",
    "sotinhchi": 2
  },
  {
    "tenmon": "Toán cao cấp A1",
    "mamon": "CB1106",
    "sotinhchi": 3
  },
  {
    "tenmon": "Toán cao cấp A2",
    "mamon": "CB1107",
    "sotinhchi": 3
  },
  {
    "tenmon": "Vật lý đại cương A1",
    "mamon": "CB1111",
    "sotinhchi": 3
  },
  {
    "tenmon": "Xác suất thống kê",
    "mamon": "CB1109",
    "sotinhchi": 3
  },
  {
    "tenmon": "Nguyên lý kế toán",
    "mamon": "EC1217",
    "sotinhchi": 2
  },

  {
    "tenmon": "Khởi nghiệp",
    "mamon": "EC1600",
    "sotinhchi": 1
  },

  {
    "tenmon": "Pháp luật đại cương",
    "mamon": "UL1104",
    "sotinhchi": 2
  },

  {
    "tenmon": "Kỹ thuật số",
    "mamon": "DT1282",
    "sotinhchi": 2
  },

  {
    "tenmon": "Tin học cơ sở",
    "mamon": "TH1201",
    "sotinhchi": 2
  },

  {
    "tenmon": "Tin học cơ sở",
    "mamon": "TH1201",
    "sotinhchi": 2
  },
  {
    "tenmon": "Toán rời rạc",
    "mamon": "TH1203",
    "sotinhchi": 2
  },
  {
    "tenmon": "Biên tập và soạn thảo VB",
    "mamon": "TH1227",
    "sotinhchi": 2
  },
  {
    "tenmon": "Cơ sở dữ liệu",
    "mamon": "TH1207",
    "sotinhchi": 3
  },
  {
    "tenmon": "Lập trình căn bản",
    "mamon": "TH1219",
    "sotinhchi": 4
  },
  {
    "tenmon": "Cấu trúc máy tính",
    "mamon": "TH1205",
    "sotinhchi": 3
  },
  {
    "tenmon": "Tin học ứng dụng",
    "mamon": "TH1522",
    "sotinhchi": 2
  },
  {
    "tenmon": "Lắp ráp cài đặt MT",
    "mamon": "TH1521",
    "sotinhchi": 2
  },
  {
    "tenmon": "Phân tích và thiết kế hệ thống thông tin",
    "mamon": "TH1305",
    "sotinhchi": 3
  },
  {
    "tenmon": "CTDL và GT",
    "mamon": "TH1206",
    "sotinhchi": 3
  },
  {
    "tenmon": "Lập trình hướng đối tượng",
    "mamon": "TH1209",
    "sotinhchi": 3
  },
  {
    "tenmon": "Hệ điều hành",
    "mamon": "TH1208",
    "sotinhchi": 3
  },
  {
    "tenmon": "An toàn và vệ sinh lao động trong lĩnh vực CNTT",
    "mamon": "TH1217",
    "sotinhchi": 1
  },
  {
    "tenmon": "Anh văn chuyên ngành",
    "mamon": "TH1354",
    "sotinhchi": 2
  },
  {
    "tenmon": "Phân tích và thiết kế thuật toán",
    "mamon": "TH1212",
    "sotinhchi": 2
  },
  {
    "tenmon": "Lập trình dotNET",
    "mamon": "TH1337",
    "sotinhchi": 4
  },
  {
    "tenmon": "Lập trình Java",
    "mamon": "TH1309",
    "sotinhchi": 3
  },
  {
    "tenmon": "Mạng máy tính",
    "mamon": "TH1214",
    "sotinhchi": 3
  },
  {
    "tenmon": "Phần mềm mã nguồn mở",
    "mamon": "TH1216",
    "sotinhchi": 2
  },
  {
    "tenmon": "Xử lý ảnh",
    "mamon": "TH1335",
    "sotinhchi": 3
  },
  {
    "tenmon": "Lập trình Web",
    "mamon": "TH1336",
    "sotinhchi": 4
  },
  {
    "tenmon": "Lập trình ứng dụng cho thiết bị di động",
    "mamon": "TH1338",
    "sotinhchi": 4
  },
  {
    "tenmon": "Sensor và ứng dụng",
    "mamon": "TH1376",
    "sotinhchi": 3
  },
  {
    "tenmon": "Internet vạn vật",
    "mamon": "TH1359",
    "sotinhchi": 3
  },
  {
    "tenmon": "Phân tích thiết kế hướng đối tượng",
    "mamon": "TH1324",
    "sotinhchi": 3
  },
  {
    "tenmon": "Trí tuệ nhân tạo",
    "mamon": "TH1333",
    "sotinhchi": 3
  },
  {
    "tenmon": "Bảo mật ứng dụng web",
    "mamon": "TH1358",
    "sotinhchi": 3
  },
  {
    "tenmon": "Hệ QTCSDL",
    "mamon": "TH1307",
    "sotinhchi": 3
  },
  {
    "tenmon": "Phát triển ứng dụng IOT",
    "mamon": "TH1369",
    "sotinhchi": 3
  },
  {
    "tenmon": "Đồ án 1",
    "mamon": "TH1507",
    "sotinhchi": 1
  },
  {
    "tenmon": "Đồ án 2",
    "mamon": "TH1512",
    "sotinhchi": 2
  },
  {
    "tenmon": "Thực tập tốt nghiệp",
    "mamon": "TH1601",
    "sotinhchi": 2
  },
  {
    "tenmon": "Thương mại điện tử",
    "mamon": "TH1606",
    "sotinhchi": 3
  },
  {
    "tenmon": "Cơ sở dữ liệu phân tán",
    "mamon": "TH1607",
    "sotinhchi": 3
  },
  {
    "tenmon": "Chuyên đề về CNTT",
    "mamon": "TH1608",
    "sotinhchi": 4
  }
]

const iotCourses = [
  {
    "tenmon": "Hệ thống nhúng",
    "mamon": "TH1355",
    "sotinhchi": 3
  },
  {
    "tenmon": "Ứng dụng máy học trong IOT",
    "mamon": "TH1361",
    "sotinhchi": 2
  },
  {
    "tenmon": "Mạng trong IOT",
    "mamon": "TH1356",
    "sotinhchi": 3
  },
  {
    "tenmon": "Phát triển ứng dụng IOT nâng cao",
    "mamon": "TH1357",
    "sotinhchi": 3
  },
  {
    "tenmon": "Phân tích dữ liệu lớn trong IOT",
    "mamon": "TH1360",
    "sotinhchi": 3
  },
  {
    "tenmon": "Ứng dụng điện toán đám mây trong IOT",
    "mamon": "TH1362",
    "sotinhchi": 2
  },
  {
    "tenmon": "Bảo mật trong IOT",
    "mamon": "TH1377",
    "sotinhchi": 3
  }
]

const networkCourses = [
  {
    "tenmon": "Quản trị mạng máy tính",
    "mamon": "TH1339",
    "sotinhchi": 3
  },
  {
    "tenmon": "Thiết kế mạng máy tính",
    "mamon": "TH1316",
    "sotinhchi": 3
  },
  {
    "tenmon": "CN mạng không dây",
    "mamon": "TH1342",
    "sotinhchi": 2
  },
  {
    "tenmon": "Hệ thống thông tin quang",
    "mamon": "TH1526",
    "sotinhchi": 2
  },
  {
    "tenmon": "Triển khai hệ thống mạng văn phòng",
    "mamon": "TH1370",
    "sotinhchi": 3
  },
  {
    "tenmon": "Lập trình mạng",
    "mamon": "TH1314",
    "sotinhchi": 3
  },
  {
    "tenmon": "An toàn và an ninh thông tin",
    "mamon": "TH1341",
    "sotinhchi": 3
  }
]

async function main() {
  const iotSpecialization = await prisma.caytientrinh.create({
    data: {
      tenchuyennganh: 'IoT',
      chuyennganh: JSON.stringify([...courseData, ...iotCourses])
    }
  });
  console.log('IoT specialization created:', iotSpecialization);

  // Create Network specialization
  const networkSpecialization = await prisma.caytientrinh.create({
    data: {
      tenchuyennganh: 'Mạng',
      chuyennganh: JSON.stringify([...courseData, ...networkCourses])
    }
  });
  console.log('Network specialization created:', networkSpecialization);

  console.log('Courses added successfully to caytientrinh table.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

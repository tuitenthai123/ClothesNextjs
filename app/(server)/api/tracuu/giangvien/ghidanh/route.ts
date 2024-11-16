import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { makhoahoc } = res;
        const datachuong = await db.ghidanh.findMany({
            where: {
                khoahoc: {
                  id_khoa: makhoahoc // Điều kiện tìm kiếm mã số sinh viên
                },
              },
              include: {
                user: true, // Lấy thêm thông tin từ bảng `User`
                khoahoc: true // Lấy thêm thông tin từ bảng `Khoahoc`
              }
        })
        return new Response(JSON.stringify(datachuong), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}
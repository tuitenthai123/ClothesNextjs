import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { useId,khoahocId } = res;
        const datachuong = await db.ghidanh.create({
            data: {
                userId: useId,
                khoahocId: khoahocId,
              },
        })
        const responsekhoahoc = await db.khoahoc.findMany({
            where:{id_khoa:khoahocId}
        })
        const soluongsinhvien = responsekhoahoc[0]?.soluongsinhvien  || 0
         await db.khoahoc.updateMany({
            where:{
                id_khoa:khoahocId
            },
            data:{
                soluongsinhvien:soluongsinhvien + 1
            }
        })
        return new Response(JSON.stringify(datachuong), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const useId = url.searchParams.get("useId");
        const khoahocId = url.searchParams.get("khoahocId") || "";
        const datachuong = await db.ghidanh.deleteMany({
            where: {
                userId: useId || "",
                khoahocId: khoahocId || "",
            },
        });
        const responsekhoahoc = await db.khoahoc.findMany({
            where:{id_khoa:khoahocId}
        })
        const soluongsinhvien = responsekhoahoc[0]?.soluongsinhvien  || 0
         await db.khoahoc.updateMany({
            where:{
                id_khoa:khoahocId
            },
            data:{
                soluongsinhvien:soluongsinhvien - 1
            }
        })

        return new Response(JSON.stringify(datachuong), { status: 200 });
    } catch (error) {
        console.error('Error deleting enrollment:', error);
        return new Response(JSON.stringify({ error: 'Error deleting enrollment' }), { status: 500 });
    }
}

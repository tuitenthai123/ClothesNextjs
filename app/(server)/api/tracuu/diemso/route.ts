import { db } from "@/lib/db";
export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { id_khoahoc,kiemtraId } = res;
        const datachuong = await db.diem.findMany({
            where:{
                id_khoahoc:id_khoahoc,
                kiemtraId:kiemtraId
            }
        })
        return new Response(JSON.stringify(datachuong), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}

import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { id_khoa,tenchuong,mota } = res;
        const response = await db.khoahoc.updateMany({
            where:{
                id_khoa:id_khoa
            },
            data:{
                mota:mota,
                tenchuong:tenchuong,
            }
        })
        return new Response(JSON.stringify(res), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}

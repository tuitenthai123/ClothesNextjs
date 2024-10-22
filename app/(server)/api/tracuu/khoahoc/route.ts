import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { maso } = res;
        const datakhoahoc = await db.khoahoc.findMany({
            where:{
                magv:maso
            }
        })
        return new Response(JSON.stringify(datakhoahoc), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const res = await request.json();
        const { makhoahoc } = res;
        const datakhoahoc = await db.khoahoc.findMany({
            where:{
                id_khoa:makhoahoc
            }
        })
        const datachuong = await db.chapter.findMany({
            where:{
                id_khoahoc:makhoahoc
            }
        })
        return new Response(JSON.stringify({datakhoahoc,datachuong}), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}
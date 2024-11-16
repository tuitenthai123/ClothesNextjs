import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { makhoahoc } = res;
        const datachuong = await db.kiemtra.findMany({
            where:{
                id_khoahoc:makhoahoc
            }
        })
        return new Response(JSON.stringify(datachuong), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const res = await request.json();
        const { makiemtra } = res;
        const datachuong = await db.kiemtra.findMany({
            where:{
                id_kiemtra:makiemtra
            }
        })
        return new Response(JSON.stringify(datachuong), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}


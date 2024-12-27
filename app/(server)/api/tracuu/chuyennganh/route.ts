import { db } from "@/lib/db";
export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { tenchuyennganh } = res;
        const datachuong = await db.caytientrinh.findMany({
            where:{
                tenchuyennganh:tenchuyennganh
            }
        })
        return new Response(JSON.stringify(datachuong), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}

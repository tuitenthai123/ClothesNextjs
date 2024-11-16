import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { useId,khoahocId } = res;
        const datachuong = await db.ghidanh.findMany({
            where: {
                userId: useId,
                khoahocId: khoahocId,
              },
        })
        return new Response(JSON.stringify(datachuong), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}
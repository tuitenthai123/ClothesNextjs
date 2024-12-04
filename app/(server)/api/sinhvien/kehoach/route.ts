import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { userId, specialization, schedule, hocky } = res;
        const existing = await db.kehoach.findFirst({
            where: { userId, hocky }
        });

        let response;
        if (existing) {
            response = await db.kehoach.update({
                where: { id: existing.id },
                data: { specialization, schedule }
            });
        } else {
            response = await db.kehoach.create({
                data: { userId, hocky, specialization, schedule }
            });
        }
        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ error: 'Error processing request' }), { status: 500 });
    }
}

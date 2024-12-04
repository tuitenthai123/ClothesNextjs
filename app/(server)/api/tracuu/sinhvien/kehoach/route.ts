import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { userId,hocky} = res;
        
        const response = await db.kehoach.findMany({
            where:{
                userId:userId,
                hocky:hocky
            }
        })
        

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}
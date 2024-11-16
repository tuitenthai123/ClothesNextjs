import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { userId,fileName,khoahocId,chapterId,fileUrl} = res;
        
        const response = await db.submission.create({
            data:{
                chapterId:chapterId,
                fileUrl:fileUrl,
                fileName:fileName,
                userId:userId,
                khoahocId:khoahocId
            }
        })
        

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}
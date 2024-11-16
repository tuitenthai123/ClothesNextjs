import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { makhoahoc,machuong } = res;
        const datachuong = await db.submission.findMany({
            where: {
               chapterId:machuong
              },
              include: {
              chapter:true,
              khoahoc:true,
              user:true,
              }
        })
        const tongsinhvien = await db.ghidanh.count({
            where:{
                khoahocId:makhoahoc
            }
        })

        const enrolledStudents = await db.ghidanh.findMany({
            where: { khoahocId: makhoahoc },
            select: {
                userId: true, 
                user: {
                    select: {
                        masv: true,
                        name: true 
                    }
                }
            }
        });

        const submittedStudents = await db.submission.findMany({
            where: {
                khoahocId: makhoahoc,
                chapterId: machuong
            },
            select: {
                userId: true 
            }
        });

        const submittedUserIds = submittedStudents.map(submission => submission.userId);

        const notSubmittedStudents = enrolledStudents.filter(enrolled => !submittedUserIds.includes(enrolled.userId));

        return new Response(JSON.stringify({datachuong,notSubmittedStudents,tongsinhvien}), { status: 200 });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        return new Response(JSON.stringify({ error: 'Error fetching timetable' }), { status: 500 });
    }
}
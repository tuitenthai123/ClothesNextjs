import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { author,creat_Time,description,image,title,update_Time,masv,id_project } = res;
        const resonse = await db.khoahoc.create({data:{
            createdAt:creat_Time,
            updatedAt:update_Time,
            id_khoa:id_project,
            tenchuong:title,
            mota:description,
            tentacgia:author,
            magv:masv,
            image:image
        }})   
        return new Response(JSON.stringify({ resonse }),{ status: 200 });
    } catch (error) {   
        console.error("Error deleting users:", error);
        return new Response(JSON.stringify({ error: "Error deleting users" }),{ status: 500 });}
}

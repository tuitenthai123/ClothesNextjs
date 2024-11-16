import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { permission,id_chuong } = res;
        const resonse = await db.chapter.updateMany({
        where:{
            id_chuong:id_chuong
        },
        data:{
           permission:permission
        }}) 
        return new Response(JSON.stringify({ resonse }),{ status: 200 });
    } catch (error) {   
        console.error("Error deleting users:", error);
        return new Response(JSON.stringify({ error: "Error deleting users" }),{ status: 500 });}
}

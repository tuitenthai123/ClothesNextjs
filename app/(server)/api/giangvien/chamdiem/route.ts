import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { diemso,id_diem,id_khoahoc,kiemtraId,userId,username } = res;

        const response = await db.diem.create({
            data:{
                id_diem:id_diem,
                diemso:diemso,
                id_khoahoc:id_khoahoc,
                kiemtraId:kiemtraId,
                userId:userId,
                username:username
            }
        })
        
        return new Response(JSON.stringify({ response }),{ status: 200 });
    } catch (error) {   
        console.error("Error deleting users:", error);
        return new Response(JSON.stringify({ error: "Error deleting users" }),{ status: 500 });}
}
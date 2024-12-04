import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { mssv,hocki } = res;
        const response = await db.kehoach.findMany({
            where:{
                hocky:hocki,
                userId:mssv
            }
        })
        
        return new Response(JSON.stringify({ response }),{ status: 200 });
    } catch (error) {   
        console.error("Error deleting users:", error);
        return new Response(JSON.stringify({ error: "Error deleting users" }),{ status: 500 });}
}
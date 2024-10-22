import { db } from "@/lib/db";
import {generateRandomId} from "@/lib/randomID"

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { title,content,id_khoahoc,tacgia } = res;
        const id_chuong = await generateRandomId(6);
        const resonse = await db.chapter.create({data:{
           id_chuong:id_chuong,
           id_khoahoc:id_khoahoc,
           ten_chuong:title,
           tentacgia:tacgia,
           content:content
        }}) 
        return new Response(JSON.stringify({ id_chuong }),{ status: 200 });
    } catch (error) {   
        console.error("Error deleting users:", error);
        return new Response(JSON.stringify({ error: "Error deleting users" }),{ status: 500 });}
}

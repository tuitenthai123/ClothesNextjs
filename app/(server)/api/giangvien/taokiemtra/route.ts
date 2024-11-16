import { db } from "@/lib/db";
import { generateRandomId } from "@/lib/randomID";

export async function POST(request: Request) {
    try {
        const ID_kiemtra = await generateRandomId(6)
        const res = await request.json();
        const { combinedData } = res;
        const response  = await db.kiemtra.create({
            data:{
                ten_kiemtra:combinedData?.testName || "Kiểm tra môn học",
                id_kiemtra:ID_kiemtra,
                id_khoahoc:combinedData?.id_khoahoc,
                endtime:combinedData?.endTime,
                ngaybatdau:combinedData?.startTime,
                questions:combinedData?.questions
            }
        })
        
        return new Response(JSON.stringify({ response }),{ status: 200 });
    } catch (error) {   
        console.error("Error deleting users:", error);
        return new Response(JSON.stringify({ error: "Error deleting users" }),{ status: 500 });}
}
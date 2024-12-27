import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { combinedData } = res;
        const response  = await db.kiemtra.updateMany({
            where:{
                id_kiemtra:combinedData?.id_kiemtra
            },
            data:{
                ten_kiemtra:combinedData?.testName || "Kiểm tra môn học",
                id_khoahoc:combinedData?.id_khoahoc,
                endtime:combinedData?.endDateTime,
                ngaybatdau:combinedData?.startDateTime,
                questions:combinedData?.questions
            }
        })
        console.log(response)
        return new Response(JSON.stringify({ response }),{ status: 200 });
    } catch (error) {   
        console.error("Error deleting users:", error);
        return new Response(JSON.stringify({ error: "Error deleting users" }),{ status: 500 });}
}

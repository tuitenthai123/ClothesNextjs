import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const { ids } = res;

        if (!ids || ids.length === 0) {
            return new Response(
                JSON.stringify({ error: "Không có user nào được chọn để xóa" }),
                { status: 400 }
            );
        }

        const response = await db.user.deleteMany({
            where: {
                id:{
                    in:ids
                },
            },
        });
        return new Response(
            JSON.stringify({ status: true, deletedCount: response.count }),
            { status: 200 }
        );
    } catch (error) {   
        console.error("Error deleting users:", error);
        return new Response(
            JSON.stringify({ error: "Error deleting users" }),
            { status: 500 }
        );
    }
}

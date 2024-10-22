import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {

        const res = await request.json();
        const { maso,hoten,pass,role } = res;
        const response = await db.user.create({
            data: {
                masv:maso,
                name:hoten,
                password:pass,
                role
            },
        })
        return new Response(JSON.stringify({ status: response }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error checking login:", error);
        return new Response(
            JSON.stringify({ error: "Error checking login" }),
            { status: 500 }
        );
    }
}

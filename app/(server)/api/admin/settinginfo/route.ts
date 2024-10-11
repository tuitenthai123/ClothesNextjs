import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {

        const res = await request.json();
        const { id, masv, name, password, role } = res;
        const response = await db.user.updateMany({
            where: {
                id: id,
                masv: masv,
            },
            data: {
                name: name,
                password: password,
                role: role
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

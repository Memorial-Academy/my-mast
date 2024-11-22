import { Metadata } from "next";
import { cookies, headers } from "next/headers";

export const metadata: Metadata = {
    title: "Dashboard | MyMAST"
}

export default async function Page() {
    const userRole = headers().get("X-UserRole");
    const cookieStore = cookies();
    const sessionCookie = JSON.parse(cookieStore.get("id")!.value);

    const userData = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${userRole}/profile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uuid: sessionCookie[1],
            token: sessionCookie[0]
        })
    })).json();
    
    return (
        <>
            <h2>Welcome, {userData.name.first}!</h2>
        </>
    )
}
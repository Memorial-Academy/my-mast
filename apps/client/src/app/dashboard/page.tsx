import ParentDashboard from "@/components/dashboard/ParentDashboard";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { authorizeSession } from "../lib/auth";

export const metadata: Metadata = {
    title: "Dashboard | MyMAST"
}

export default async function Page() {
    const userRole = headers().get("X-UserRole");
    const session = (await authorizeSession())!

    const userData = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${userRole}/profile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(session)
    })).json();
    
    return (
        <>
            <h2>Welcome, {userData.name.first}!</h2>
            {userRole == "parent" && <ParentDashboard uuid={session.uuid} token={session.token} />}
            {userRole == "volunteer" && <p>hi</p>}
        </>
    )
}
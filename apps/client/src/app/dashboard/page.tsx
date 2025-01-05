import ParentDashboard from "@/components/dashboard/ParentDashboard";
import { Metadata } from "next";
import { headers } from "next/headers";
import authorizeSession from "@mymast/utils/authorize_session";
import VolunteerDashboard from "@/components/dashboard/VolunteerDashboard";

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
            {userRole == "volunteer" && <VolunteerDashboard uuid={session.uuid} token={session.token} /> }
        </>
    )
}
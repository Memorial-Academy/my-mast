import ParentDashboard from "@/components/dashboard/ParentDashboard";
import { Metadata } from "next";
import { headers } from "next/headers";
import authorizeSession from "@mymast/utils/authorize_session";
import VolunteerDashboard from "@/components/dashboard/VolunteerDashboard";
import API from "../lib/APIHandler";

export const metadata: Metadata = {
    title: "Dashboard | MyMAST"
}

export default async function Page() {
    const userRole = headers().get("X-UserRole") as "volunteer" | "parent" | "student";
    const session = (await authorizeSession())!

    const userData = await API.User.profile(userRole, session.uuid, session.token);
    
    return (
        <>
            <h2>Welcome, {userData.name.first}!</h2>
            {userRole == "parent" && <ParentDashboard uuid={session.uuid} token={session.token} />}
            {userRole == "volunteer" && <VolunteerDashboard uuid={session.uuid} token={session.token} /> }
        </>
    )
}
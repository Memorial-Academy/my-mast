import API from "@/app/lib/APIHandler";
import AccountSettingsForm, { ManageStudents } from "@/components/account_settings/AccountSettings";
import { UserTypesString } from "@mymast/api/Types";
import sessionInfo from "@mymast/utils/authorize_session";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
    title: "My Account | MyMAST"
}

export default async function Page() {
    let session = (await sessionInfo())!;
    // let role: UserTypesString = await API.Auth.getRole(session.uuid, session.token);
    let role: UserTypesString = headers().get("X-UserRole") as UserTypesString;
    let profile = await API.User.profile(role, session.uuid, session.token);

    return (
        <>
            <h2>My Account</h2>
            {/* <p>Account type: {role}</p> */}
            <AccountSettingsForm
                session={session}
                role={role}
                profile={profile}
            />
            
            {role == "parent" && <ManageStudents session={session} />}
        </>
    )
}

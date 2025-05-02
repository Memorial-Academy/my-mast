"use server";
import sessionInfo from "@mymast/utils/authorize_session";
import { redirect } from "next/navigation";

export default async function SubmitNewProgram(programData: ProgramDataSubmitted) {
    const authCookie = (await sessionInfo())!;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/createprogram`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: authCookie.token,
            uuid: authCookie.uuid,
            data: programData
        })
    })

    if (res.status == 200) {
        redirect(`${process.env.NEXT_PUBLIC_MYMAST_URL}/programs/volunteer/${await res.text()}?revalidate`);
    } else {
        return res.statusText;
    }
}
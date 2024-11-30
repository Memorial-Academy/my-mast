"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SubmitNewProgram(programData: ProgramData) {
    const authCookie = JSON.parse(cookies().get("id")!.value);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/createprogram`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: authCookie[0],
            uuid: authCookie[1],
            data: programData
        })
    })

    if (res.status == 200) {
        // redirect(`${process.env.NEXT_PUBLIC_MYMAST_URL}/programs/enroll/${await res.text()}`);
    }
}
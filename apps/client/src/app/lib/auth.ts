"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function POSTData(data: FormData, endpoint: string) {
    return fetch(process.env.NEXT_PUBLIC_API_URL + endpoint, {
        method: "POST",
        body: data
    })
}

export default async function authenticate(data: FormData, endpoint: string, programRedirect?: string) {
    const cookieStore = cookies();
    const serverRes = await POSTData(data, endpoint);

    if (!serverRes.ok) {
        return await serverRes.text();
    } else {
        let credentials = await serverRes.json();
        /* Session cookie syntax:
         * [0]: token
         * [1]: uuid
         */
        cookieStore.set({
            name: "id",
            value: JSON.stringify([
                credentials.sessionToken,
                credentials.uuid
            ]),
            httpOnly: true,
            maxAge: (credentials.sessionExpiry - Date.now()) / 1000,
            expires: new Date(credentials.sessionExpiry),
            secure: true,
            sameSite: "strict",
            domain: process.env.NODE_ENV === "production" ? ".memorialacademy.org" : "localhost"
        })

        if (programRedirect) {
            redirect(`/programs/enroll/${programRedirect}`);
        } else {
            redirect("/dashboard");
        }
    }
}
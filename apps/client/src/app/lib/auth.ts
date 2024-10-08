"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function POSTData(data: FormData, endpoint: string) {
    return fetch(process.env.NEXT_PUBLIC_API_URL + endpoint, {
        method: "POST",
        body: data
    })
}

export default async function authenticate(data: FormData, endpoint: string) {
    const cookieStore = cookies();
    const serverRes = await POSTData(data, endpoint);

    if (!serverRes.ok) {
        return "Encountered error";
    } else {
        let credentials = await serverRes.json();
        cookieStore.set({
            name: "id",
            value: credentials.sessionToken,
            httpOnly: true,
            maxAge: (credentials.sessionExpiry - Date.now()) / 1000,
            expires: new Date(credentials.sessionExpiry),
            secure: true,
            sameSite: "strict"
        })
    }

    redirect("/dashboard");
}
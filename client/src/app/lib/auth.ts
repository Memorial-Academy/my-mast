"use server";
import { cookies } from "next/headers";

function POSTData(data: FormData, endpoint: string) {
    return fetch(process.env.NEXT_PUBLIC_API_URL + endpoint, {
        method: "POST",
        body: data
    })
}

export async function loginUser(data: FormData) {
    POSTData(data, "/auth/login");
}

export async function signupUser(data: FormData) {
    const cookieStore = cookies();
    const serverRes = await POSTData(data, "/auth/signup");

    if (!serverRes.ok) {
        return "Could not create account";
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

    return "";
}
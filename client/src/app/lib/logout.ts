"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function logoutUser() {
    let cookieStore = cookies();

    if (!cookieStore.has("id")) return;

    let logoutRequest = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        body: cookieStore.get("id")!.value
    });

    if (logoutRequest.ok) {
        cookieStore.delete("id");
        redirect("/");
    }
}
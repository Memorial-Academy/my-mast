"use server";
import { revalidatePath } from "next/cache";

export default async function revalidateProgramPageCache(program_id: string) {
    // revalidate client
    let revalidationRequest = fetch(`${process.env.NEXT_PUBLIC_MYMAST_URL}/programs/volunteer/${program_id}?revalidate`);
    revalidationRequest.catch((err) => {
        console.error("Revalidation failed:\n" + err);
    })
    // revalidate admin
    revalidatePath(`/program/${program_id}`);
}
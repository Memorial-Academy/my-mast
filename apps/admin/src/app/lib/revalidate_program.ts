export default async function revalidateProgramPageCache(program_id: string) {
    let revalidationRequest = fetch(`${process.env.NEXT_PUBLIC_MYMAST_URL}/programs/volunteer/${program_id}?revalidate`);
    revalidationRequest.catch((err) => {
        console.error("Revalidation failed:\n" + err);
    })
}
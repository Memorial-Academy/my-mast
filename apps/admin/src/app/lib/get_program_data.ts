import { redirect } from "next/navigation";

export default async function getProgramData(id: string) {
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/program/${id}`)

    if (req.status != 200) {
        redirect("/404");
    }

    const data: ProgramData = await req.json();
    return data;
}
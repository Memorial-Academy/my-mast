import "@/styles/program_manager.css"
import ProgramManagerNav from "@/components/program_manager/Nav";
import { ReactNode } from "react";


type Params = Promise<{
    signup: string,
    id: string
}>

export async function generateMetadata({params}: {params: Params}) {
    const id = (await params).id;

    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/program/${id}`)
    const data: ProgramData = await req.json();

    return {
        title: `${data.name} - Program Manager | Admin Control Panel | Memorial Academy of Science and Technology`
    }
}

export default async function Layout({params, children}: {params: Params, children: ReactNode}) {
    const id = (await params).id;

    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/program/${id}`)
    const data: ProgramData = await req.json();


    return (
        <>
            <ProgramManagerNav id={data.id} name={data.name} />
            {children}
        </>
    )
}




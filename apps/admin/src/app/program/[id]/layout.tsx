import "@/styles/program_manager.css"
import ProgramManagerNav from "@/components/program_manager/Nav";
import { ReactNode } from "react";
import getProgramData from "@/app/lib/get_program_data";
import API from "@/app/lib/APIHandler";
import { redirect } from "next/navigation";

type Params = Promise<{
    signup: string,
    id: string
}>

// export async function generateMetadata({params}: {params: Params}) {
//     const data = await getProgramData((await params).id);

//     return {
//         title: `${data.name} - Program Manager | Admin Control Panel | Memorial Academy of Science and Technology`
//     }
// }

export default async function Layout({params, children}: {params: Params, children: ReactNode}) {
    let data;
    try {
        data = await API.Application.getProgram((await params).id);
    } catch(e) {
        console.log("Invalid ID!")
        redirect("/404")
    }

    return (
        <main className="program-manager">
            <ProgramManagerNav id={data.id} name={data.name} />
            <div className="program-manager-display">
                {children}
            </div>
        </main>
    )
}




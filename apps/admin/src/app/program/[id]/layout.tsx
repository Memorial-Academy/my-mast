import "@/styles/program_manager.css"
import ProgramManagerNav from "@/components/program_manager/Nav";
import { ReactNode } from "react";
import getProgramData from "@/app/lib/get_program_data";

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
    const data = await getProgramData((await params).id);

    return (
        <>
            <ProgramManagerNav id={data.id} name={data.name} />
            {children}
        </>
    )
}




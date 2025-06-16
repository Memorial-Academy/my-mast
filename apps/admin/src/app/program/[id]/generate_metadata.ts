import API from "@/app/lib/APIHandler";

export type ParamsArgument = {
    params: Promise<{
        id: string
    }>
}

export default function generateProgramManagerMetadata(pageTitle: string) {
    return async ({params}: ParamsArgument) => {
        const data = await API.Application.getProgram((await params).id);
    
        return {
            title: `${pageTitle.length > 0 ? `${pageTitle} - ` : ""}${data.name} - Program Manager | Admin Control Panel | Memorial Academy of Science and Technology`
        }
    }
}
import CreateProgramForm from "@/components/NewProgramForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create New Program | Admin Control Panel | Memorial Academy of Science and Technology"
}

export default function Page() {
    return (
        <>
            <h2>Add a new program</h2>
            <p>Completing this form will create a new program in the MyMAST database. Volunteers and parents will immediately be able to begin enrolling in this program.</p>
            <CreateProgramForm/>
        </>
    )
}
import CreateProgramForm from "@/components/NewProgramForm";
import { Metadata } from "next";
import sessionInfo from "@mymast/utils/authorize_session";

export const metadata: Metadata = {
    title: "Create New Program | Admin Control Panel | Memorial Academy of Science and Technology"
}

export default async function Page() {
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/volunteer/profile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(await sessionInfo()!)
    }) 

    let autofillContactInfo;

    if (req.ok) {
        let profile = await req.json();
        autofillContactInfo = {
            first: profile.name.first,
            last: profile.name.last,
            phone: profile.phone,
            email: profile.email
        }
    }

    

    return (
        <>
            <h2>Add a new program</h2>
            <p>Completing this form will create a new program in the MyMAST database. Volunteers and parents will immediately be able to begin enrolling in this program.</p>
            <CreateProgramForm contact={autofillContactInfo} />
        </>
    )
}
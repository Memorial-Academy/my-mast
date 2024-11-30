import { Metadata } from "next";
import { redirect } from "next/navigation";
import ProgramInfo from "@/components/program_signup/ProgramInfo";
import { cookies } from "next/headers";

type Params = Promise<{
    signup: string,
    id: string
}>

type GenerateMetadataProps = {
    params: Params,
    searchParams: Promise<{ [key: string]: undefined }>
}

export async function generateMetadata({params, searchParams}: GenerateMetadataProps): Promise<Metadata> {
    const id = (await params).id;
    const signupType = (await params).signup;
    const data = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/program/${id}`)).json();


    return {
        title: `${signupType == "volunteer" ? "Volunteer for " : "Enroll in "} ${data.name} | Memorial Academy of Science and Technology`,
        description: `${signupType == "volunteer" ? "Volunteer for " : "Enroll in "} ${data.name} at the Memorial Academy of Science and Technology`
    }
}

export default async function Page({params}: {params: Params}) {
    const id = (await params).id;
    const signupType = (await params).signup;
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/program/${id}`);

    if (["volunteer", "enroll"].indexOf(signupType) == -1 || req.status != 200) {
        redirect("/programs");
    }

    const data: ProgramData = await req.json();

    // Check whether a user is logged in
    const cookieStore = cookies();

    let session = {
        uuid: "",
        token: "",
        role: ""
    }
    if (cookieStore.has("id")) {
        let authCookie = JSON.parse(cookieStore.get("id")!.value)
        session.uuid = authCookie[1];
        session.token = authCookie[0];

        session.role = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/role/${session.uuid}`)).text()

        if ((session.role == "parent" && signupType != "enroll") || (session.role == "volunteer" && signupType != "volunteer")) {
            redirect(`/programs/${session.role == "parent" ? "enroll" : "volunteer"}/${id}`);
        }
    }

    return (
        <>
            <ProgramInfo data={data} signupType={signupType} uuid={session.uuid} />
        </>
    )
}
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ProgramInfo from "@/components/program_signup/ProgramInfo";
import authorizeSession from "@mymast/utils/authorize_session";
import API from "@/app/lib/APIHandler";
import { revalidatePath } from "next/cache";

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

export default async function Page({params, searchParams}: GenerateMetadataProps) {
    const id = (await params).id;
    const signupType = (await params).signup;
    console.log(await searchParams);

    // revalidate cache if the URL contains the "?revalidate" parameter
    if (Object.keys(await searchParams).indexOf("revalidate") != -1) {
        revalidatePath("/programs");
    }

    let students: {
        name: {
            first: string,
            last: string
        },
        uuid: string
    }[] = [];  // filled with information of students later

    if (["volunteer", "enroll"].indexOf(signupType) == -1) {
        redirect("/programs");
    }

    const data = await API.Application.getProgram(id);
    if (Object.keys(data).indexOf("code") != -1 && (data as any).code != 200) {
        notFound();
        
    }

    // Check whether a user is logged in
    const authCookie = await authorizeSession();

    let session = {
        uuid: "",
        token: "",
        role: ""
    }
    if (authCookie) {
        session.uuid = authCookie.uuid;
        session.token = authCookie.token;

        session.role = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/role`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uuid: authCookie.uuid,
                token: authCookie.token
            })
        })).text()

        if ((session.role == "parent" && signupType != "enroll") || (session.role == "volunteer" && signupType != "volunteer")) {
            redirect(`/programs/${session.role == "parent" ? "enroll" : "volunteer"}/${id}`);
        }

        // get information about students
        if (signupType == "enroll") {
            const studentInfo = await API.User.parentGetStudents(session.uuid, session.token);
            

            students = studentInfo.map((student) => {
                return {
                    name: student.name,
                    uuid: student.uuid
                }
            })
        }
    }

    return (
        <>
            {/* "You're an admin!" notice */}
            {data.admins.indexOf(session.uuid) != -1 && <p>
                <b>You're an administrator for this program!</b>
                &nbsp;Visit the MyMAST Admin Control Panel to manage this course.
            </p>}

            <ProgramInfo 
                data={data} 
                signupType={signupType}
                user={{
                    uuid: session.uuid,
                    sessionToken: session.token
                }}
                students={students}
            />
        </>
    )
}
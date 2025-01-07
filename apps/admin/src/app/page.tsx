import { Card } from "@mymast/ui";
import sessionInfo from "@mymast/utils/authorize_session";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Admin Control Panel | Memorial Academy of Science and Technology",
    description: "Adminstrative control panel for the Memorial Academy of Science and Technology",
};

export default async function Home() {
    const auth = (await sessionInfo())!;

    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/managedprograms`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uuid: auth.uuid,
            token: auth.token
        })
    })

    let programs: Array<ProgramData> = []

    if (req.ok) {
        programs = await req.json();
    }

    return (
        <>
            <h2>My Programs</h2>
            {programs.length > 0 && programs.map(program => {
                return (
                    <Card 
                        header={program.name}
                        actionLink={{
                            text: "Manage program",
                            link: `/program/${program.id}`
                        }}
                    >
                        <div className="trifold">
                            <p>
                                <b>Enrollments</b>
                                <br/>
                                Students: {program.enrollments.students.length}
                                <br/>
                                Volunteers: {program.enrollments.volunteers.length}
                            </p>
                        </div>
                    </Card>
                )
            })}
            {programs.length == 0 && <p>You don't manage any programs currently.</p>}
            <p><Link href="/new_program">+ Add a program</Link></p>
        </>
    );
}

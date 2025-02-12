import { Card } from "@mymast/ui";
import EnrollmentCard from "./EnrollmentCard";

type VolunteerDashboardProps = {
    uuid: string
    token: string
}

export default async function VolunteerDashboard(props: VolunteerDashboardProps) {
    const signupsReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/volunteer/assignments`, {
        method: "POST",
        body: JSON.stringify({
            uuid: props.uuid,
            token: props.token
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    const signups: {
        pending: Array<any>,
        assignments: Array<any>
    } = await signupsReq.json();

    return (
        <>
            <p>
                Your MyMAST dashboard allows you to see everything related to your volunteering commitments at MAST. Missed an email? Checking your volunteering hours? All the information you need is right here!
                <br/>
                If you're assigned instructor duties, this dashboard will allow you to access controls for your program, such as attendance rosters, curriculums, and parent contact information.
            </p>
            <h2>My Signups</h2>
            
            {/* Pending assignments */}
            {signups.pending && <>
                <h3>Pending Assignments</h3>
                <p>
                    When signing up to volunteer for MAST, program directors will review your signup first to ensure there are no problems with your signup. In programs with multiple courses and/or weeks, program directors may also assign you to specific courses and/or specific weeks.
                    <br/>
                    We rarely cancel volunteer signups. If your signup appears here for an extended length of time, that's ok! You are still signed up to volunteer and will receive information on your signup. Email <a href="mailto:volunteer@memorialacademy.org">volunteer@memorialacademy.org</a> if you have any concerns, are your signup still displays here less than one week before the program begins.
                </p>
                {signups.pending.map(async (pendingAssignment, index) => {
                    const program: ProgramData = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/program/${pendingAssignment.program}`)).json()

                    return <Card
                        key={program.id}
                        header={program.name}
                    >
                        <div className="bi-fold">
                            <div>
                                <p>Thanks for signing up to volunteer at {program.name}!</p>
                                <p>
                                    <b>Signup Information</b>
                                    <br/>
                                    You requested to volunteer for ...
                                </p>
                                <p>
                                    Your signup is currently waiting to be finalized by a program director. Once finalized, you'll be able to access a full schedule for your assigned course/week, in addition to other information. For now, please refer to the <a href={`/programs/volunteer/${program.id}`}>signup page</a> for more information on this signup.
                                </p>
                                <p>You're eligible for approximately <b>{pendingAssignment.hours}</b> volunteering hours from this signup!</p>
                            </div>
                            <div>
                                <p>
                                    <b>Location:</b> {program.location.common_name}
                                </p>
                                <p>
                                    <b>Program Director</b> (Questions? This is the person to contact!)
                                    <br/>
                                    Name: {program.contact.name.first} {program.contact.name.last}
                                    <br/>
                                    Email: <a href={`mailto:${program.contact.email}`}>{program.contact.email}</a>
                                    <br/>
                                    Phone: {program.contact.phone}
                                </p>
                            </div>
                        </div>
                    </Card>
                })}
            </>}
        </>
    )
}
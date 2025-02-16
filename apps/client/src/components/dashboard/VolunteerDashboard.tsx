import { Card } from "@mymast/ui";
import API from "@/app/lib/APIHandler";

type VolunteerDashboardProps = {
    uuid: string
    token: string
}

export default async function VolunteerDashboard(props: VolunteerDashboardProps) {
    const signups = await API.User.getVolunteerAssignments(props.uuid, props.token);

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
                    We rarely cancel volunteer signups. If your signup appears here for an extended length of time, that's ok! You are still signed up to volunteer and will receive information on your signup. Email <a href="mailto:volunteer@memorialacademy.org">volunteer@memorialacademy.org</a> if you have any concerns, or your signup still displays here less than one week before the program begins.
                </p>
                {signups.pending.map(async (pendingAssignment) => {
                    const program = await API.Application.getProgram(pendingAssignment.program);

                    return <Card
                        key={program.id}
                        header={program.name}
                    >
                        <div className="bi-fold">
                            <div>
                                <p>Thanks for signing up to volunteer at {program.name}!</p>
                                <p>
                                    <b>Signup Information</b>
                                </p>
                                    {program.courses.length > 1 && <>
                                        <p>You requested to volunteer for:</p>
                                        <ul>
                                            {pendingAssignment.courses.map((course) => {
                                                return <li>{program.courses[course].name}</li>
                                            })}
                                        </ul>
                                        <p>Note: while requests are taken into account when assigning volunteers to courses, the final decision will be based on a combination of students in each course, volunteer availability, reported skills, instructor interest, and more. Requests do not guarantee an assignment to specific courses.</p>
                                    </>}
                                <p>You signed up to volunteer for the following week{program.schedule.length > 1 ? "s" : ""}:</p>
                                <ul>
                                    {pendingAssignment.weeks.map((week) => {
                                        return <li>Week {week} ({program.schedule[week - 1][0].month}/{program.schedule[week - 1][0].date}/{program.schedule[week - 1][0].year} - {program.schedule[week - 1].at(-1)!.month}/{program.schedule[week - 1].at(-1)!.date}/{program.schedule[week - 1].at(-1)!.year})</li>
                                    })}
                                </ul>
                                {pendingAssignment.instructor && <p>You indicated you are interested in being an instructor for this course. If needed, your program director may assign you this role in a specific course and contact you about extra duties as part of this role.</p>}
                                <p>
                                    Your signup is currently waiting to be finalized by a program director. Once finalized, you'll be able to access a full schedule for your assigned course/week, in addition to other information. For now, please refer to the <a href={`/programs/volunteer/${program.id}`}>signup page</a> for more information on this signup.
                                </p>
                                <p>You're eligible for approximately <b>{pendingAssignment.hours}</b> volunteering hours from this signup!</p>
                            </div>
                            <div>
                                <p>
                                    <b>Location:</b> {program.location.common_name}
                                    <br/>
                                    {program.location.loc_type == "physical" ? <>
                                        {program.location.address}
                                        <br/>
                                        {program.location.city}, {program.location.state} {program.location.zip}
                                    </> : <>{program.location.link || "Virtual classroom link will be released soon!"}</>}
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
import API from "@/app/lib/APIHandler";
import { ConfirmedVolunteerAssignment } from "@mymast/api/Types";
import { Card } from "@mymast/ui";
import getTimestamp from "@mymast/utils/convert_timestamp";

export default function ConfirmedVolunteerAssignmentsSection({signups}: {signups: ConfirmedVolunteerAssignment[]}) {
    return (
        <>
            {signups.length > 0 && <>
                {/* heading and section explanation */}
                <h3>Confirmed Assignments</h3>
                <p>
                    Signups in this section have been reviewed and approved by the program director and are ready for you to show up for! If the program you signed up for has multiple courses, your signup will display which courses you've been assigned to and for which week(s) (if applicable).
                    <br/>
                    Any questions about a confirmed signup? Try contacting the program director listed for your program directly. Otherwise, we're always here to help at <a href="mailto:volunteer@memorialacademy.org">volunteer@memorialacademy.org</a>.
                    <br/>
                    Thanks for volunteering!
                </p>

                {/* loopthrough all assignments and generate cards for each */}
                {signups.map(async (assignment) => {
                    const program = await API.Application.getProgram(assignment.program);

                    return <Card
                        key={assignment.id}
                        header={program.name}
                    >
                        <div className="bi-fold">
                            <div>
                                <p>Thanks for signing up to volunteer at {program.name}! We're excited to have you join us!</p>

                                {/* assignments */}
                                <p>
                                    <b>Your Assignments</b>
                                </p>
                                {/* print detailed list if the program has multiple courses */}
                                {program.courses.length > 1 && <>
                                    {assignment.commitments.map(commitment => {
                                        return (
                                            <p>During week {commitment.week}, you will be assigned to {program.courses[commitment.course].name}. {commitment.instructor && "You will be an instructor for the course during this week; congratulations!"}</p>
                                        )
                                    })}
                                </>}
                                {/* otherwise, just print the weeks the volunteer will be working */}
                                {program.courses.length == 1 && <>
                                    <p>
                                        You've signed up to volunteer for the following weeks:
                                    </p>
                                    <ul>
                                        {assignment.commitments.map(commitment => {
                                            return <li>Week {commitment.week}</li>
                                        })}
                                    </ul>
                                </>}

                                {/* schedule */}
                                <p>
                                    <b>Program Schedule</b>
                                </p>
                                <div className="tri-fold">
                                    {program.schedule.map((week, index) => {
                                        return <p>
                                            <ins>Week {index + 1}</ins>
                                            <br/>
                                            {week.map(day => {
                                                return <span>{day.month}/{day.date}/{day.year}: {getTimestamp(day.start)} - {getTimestamp(day.end)}<br/></span>
                                            })}
                                        </p>
                                    })}
                                </div>
                            </div>
                            <div>
                                <p><b>Volunteering Hours</b></p>
                                <p>
                                    <ins>Current hours earned: {assignment.hours}</ins>
                                </p>
                                <p>
                                    Contact the program director for questions relating to volunteering hours, including NHS/service hours and any inaccuracies.
                                    <br/>
                                    Hours are automatically updated based on attendance.
                                </p>
                                <p><b>Who to Contact?</b></p>
                                <p>
                                    The program director for {program.name} is {program.contact.name.first} {program.contact.name.last}.
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
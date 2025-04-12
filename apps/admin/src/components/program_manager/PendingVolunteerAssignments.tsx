import { PendingVolunteerAssignment, Program, UserTypes } from "@mymast/api/Types";
import { Card } from "@mymast/ui";
import calculateAge from "@mymast/utils/birthday";
import AssignVolunteerPopup from "./AssignVolunteerPopup";

type PendingVolunteerAssignmentsProps = {
    program: Program,
    assignments: {
        signup: PendingVolunteerAssignment,
        volunteer: UserTypes.Volunteer
    }[]
}

export default function PendingVolunteerAssignments(props: PendingVolunteerAssignmentsProps) {
    return (
        <>
            {props.assignments.map(signup => {
                let age = calculateAge(signup.volunteer.birthday);

                return (
                    <Card
                        header={`${signup.volunteer.name.first} ${signup.volunteer.name.last}`}
                    >
                        <div className="bi-fold">
                            <p>
                                <b>Contact Information</b>
                                <br/>
                                Email: {signup.volunteer.email}
                                <br/>
                                Phone: {signup.volunteer.phone}
                            </p>
                            <p>
                                <b>Volunteer Information</b>
                                <br/>
                                School: {signup.volunteer.school}
                                <br/>
                                Age: {age.years} years and {age.months} months (born {age.birthdayString})
                            </p>
                        </div>
                        <div className={signup.signup.skills ? "bi-fold" : ""}>
                            <p>
                                <b>Reported Skills/Notes</b>
                                <br/>
                                {signup.volunteer.skills || "N/A"}
                            </p>
                            {signup.signup.skills && <p>
                                <b>Signup-specific Skills/Notes</b>
                                <br/>
                                {signup.signup.skills}
                            </p>}
                        </div>

                        <p><b>Signup Information</b></p>
                        {signup.signup.instructorInterest && <p>{signup.volunteer.name.first} is interested in being an instructor.</p>}
                        <div className="bi-fold">
                            <div>
                                <p>Requested courses:</p>
                                <ul>
                                    {signup.signup.courses.map(course => {
                                        return <li>{props.program.courses[course].name}</li>
                                    })}
                                </ul>
                            </div>
                            <div>
                                <p>Signed up for week(s):</p>
                                <ul>
                                    {signup.signup.weeks.map(week => {
                                        return <li>Week {week}</li>
                                    })}
                                </ul>
                            </div>
                        </div>
                        <AssignVolunteerPopup 
                            name={`${signup.volunteer.name.first} ${signup.volunteer.name.last}`}
                            program={{
                                name: props.program.name,
                                id: props.program.id,
                                courses: props.program.courses,
                                schedule: props.program.schedule
                            }}
                            signup={{
                                courses: signup.signup.courses,
                                weeks: signup.signup.weeks,
                                skills: signup.volunteer.skills,
                                additionalNotes: signup.signup.skills,
                                instructor: signup.signup.instructorInterest
                            }}
                            enrollment={{
                                id: signup.signup.id,
                                volunteerID: signup.volunteer.uuid
                            }}
                        />
                    </Card>
                )
            })}
        </>
    )
}
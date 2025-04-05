import { ConfirmedVolunteerAssignment, Program, UserTypes } from "@mymast/api/Types"
import { Table } from "@mymast/ui"

type ConfirmedVolunteerAssignmentsProps = {
    program: Program,
    assignments: {
        signup: ConfirmedVolunteerAssignment,
        volunteer: UserTypes.Volunteer
    }[]
}

export default async function ConfirmedVolunteerAssignments(props: ConfirmedVolunteerAssignmentsProps) {
    
    
    return (
        <>
            {props.program.schedule.map((signup, index) => {
                let weeklyTotal = 0;
                return (
                    <section className="enrollment-section" key={`week_${index}`}>
                        <h3>Week {index + 1}</h3>
                        <p><b>Signups:</b> {weeklyTotal}</p>

                        {props.program.courses.map(course => {
                            if (course.available.indexOf(index + 1) == -1) {
                                return;
                            }

                            let courseTotal = 0;

                            return (
                                <>
                                    {props.program.courses.length > 1 && <>
                                        <h4>{course.name}</h4>
                                        <p><b>Signups for course: {courseTotal}</b></p>
                                    </>}
                                    <Table.Root
                                        columns={[
                                            "Name",
                                            "Email",
                                            "Phone"
                                        ]}
                                    >
                                        {props.assignments.map(signup => {
                                            for (let commitment of signup.signup.commitments) {
                                                if (commitment.week == index + 1 && commitment.course == course.id) {
                                                    weeklyTotal += 1;
                                                    courseTotal += 1;

                                                    return (
                                                        <Table.Row
                                                            data={[
                                                                <span>{signup.volunteer.name.first} {signup.volunteer.name.last} {commitment.instructor ? <b>(Instructor)</b> : ""}</span>,
                                                                signup.volunteer.email,
                                                                signup.volunteer.phone
                                                            ]}
                                                        />
                                                    )
                                                }
                                            }
                                        })}
                                    </Table.Root>
                                </>
                            )
                        })}
                    </section>
                )
            })}
        </>
    )
}
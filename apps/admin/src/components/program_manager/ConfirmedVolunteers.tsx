import { ConfirmedVolunteerAssignment, Course, Program, UserTypes } from "@mymast/api/Types"
import { Table } from "@mymast/ui"
import { Fragment } from "react"

type ConfirmedVolunteerAssignmentsProps = {
    program: Program,
    assignments: {
        signup: ConfirmedVolunteerAssignment,
        volunteer: UserTypes.Volunteer
    }[]
}

type SignupsPerCourse = {
    course: Course,
    courseTotal: number,
    volunteers: UserTypes.Volunteer[],
    instructors: boolean[]
}

export async function ConfirmedVolunteerAssignmentsByWeek(props: ConfirmedVolunteerAssignmentsProps) {
    let signups = new Array<{
        week: number,
        weeklyTotal: number,
        courses: SignupsPerCourse[],
    }>()
    
    // setup signups array for each week
    for (var week = 1; week <= props.program.schedule.length; week++) {
        let weeklySignups = {
            week: week,
            weeklyTotal: 0,
            courses: new Array<SignupsPerCourse>(props.program.courses.length)
        }

        signups.push(weeklySignups);
    }

    // add courses to each week
    for (var course of props.program.courses) {
        for (var week of course.available) {
            if (signups[week - 1].courses.indexOf({
                course: course,
                courseTotal: 0,
                volunteers: new Array<UserTypes.Volunteer>(),
                instructors: new Array<boolean>()
            }) != -1) continue;

            signups[week - 1].courses.splice(course.id, 0, {
                course: course,
                courseTotal: 0,
                volunteers: new Array<UserTypes.Volunteer>(),
                instructors: new Array<boolean>()
            })

            if (course.duration > 1) {
                for (var extension = 1; extension < course.duration; extension++) {
                    signups[week - 1 + extension].courses.splice(course.id, 0, {
                        course: course,
                        courseTotal: 0,
                        volunteers: new Array<UserTypes.Volunteer>(),
                        instructors: new Array<boolean>()
                    })
                }
            }
        }
    }

    // add signups to each course/week
    for (var signup of props.assignments) {
        for (var commitment of signup.signup.commitments) {
            signups[commitment.week - 1].courses[commitment.course].volunteers.push(signup.volunteer);
            signups[commitment.week - 1].courses[commitment.course].instructors.push(commitment.instructor);
            signups[commitment.week - 1].weeklyTotal++;
            signups[commitment.week - 1].courses[commitment.course].courseTotal++;
        }
    }
    
    return (
        <>
            {signups.map(week => {
                return (
                    <section className="enrollment-section" key={`week_${week.week}`}>
                        <h3>Week {week.week}</h3>
                        <p><b>Signups:</b> {week.weeklyTotal}</p>

                        {week.courses.map(course => {
                            if (!course) return;

                            return (
                                <Fragment key={course.course.name}>
                                    <h4>{course.course.name}</h4>
                                    <p><b>Signups: </b> {course.courseTotal}</p>
                                    <Table.Root
                                        columns={[
                                            "Name",
                                            "Email",
                                            "Phone"
                                        ]}
                                    >
                                        {course.volunteers.map((volunteer, i) => {
                                            return (
                                                <Table.Row
                                                    key={volunteer.uuid + "_" + week.week + "_" + course.course.id}
                                                    data={[
                                                        <span>
                                                            {volunteer.name.first} {volunteer.name.last}&nbsp;
                                                            {course.instructors[i] ? <b>(Instructor)</b> : ""}
                                                        </span>,
                                                        volunteer.email,
                                                        volunteer.phone
                                                    ]}
                                                />
                                            )
                                        })}
                                    </Table.Root>
                                </Fragment>
                            )
                        })}
                    </section>
                )
            })}
        </>
    )
}
"use client"
import submitVolunteerAssignments from "@/app/lib/assign_commitments"
import { Course, WeeklySchedule } from "@mymast/api/Types"
import { Popup, Table } from "@mymast/ui"
import { useState } from "react"

type AssignVolunteerPopupProps = {
    name: string
    enrollment: {
        id: string,
        volunteerID: string
    }
    program: {
        courses: Course[],
        schedule: WeeklySchedule[],
        id: string,
        name: string
    },
    signup: {
        courses: number[],
        weeks: number[],
        skills?: string,
        additionalNotes?: string,
        instructor: boolean
    }
}

export default function AssignVolunteerPopup(props: AssignVolunteerPopupProps) {
    const [active, setActive] = useState(false);

    let coursesPerWeek = new Array<{
        week: number,
        courses: Course[]
    }>();
    for (let week = 1; week <= props.program.schedule.length; week++) {
        coursesPerWeek.push({
            week: week,
            courses: []
        })
    }

    for (let course of props.program.courses) {
        for (let week of course.available) {
            let arr = coursesPerWeek[week - 1].courses;
            if (arr.indexOf(course) != -1) continue; // ensure no duplicate courses

            // no duplicates, so add course to that week
            coursesPerWeek[week - 1].courses.push(course);

            // extend multi-week courses across multiple weeks
            if (course.duration > 1) {
                for (var extension = 1; extension < course.duration; extension++) {
                    coursesPerWeek[week - 1 + extension].courses.push(course);
                }
            }
        }
    }

    return (
        <>
            <a href="#" onClick={e => {
                e.preventDefault();
                setActive(true);
            }}>Assign volunteer to courses/weeks</a>
            <Popup
                active={active}
                onClose={() => {
                    setActive(false)
                }}
            >
                <h2>Assign commitments to {props.name} for {props.program.name}</h2>
                
                <p>
                    <b>Skills/Notes</b>
                    <br/>
                    {props.signup.skills || "N/A"}
                </p>
                {props.signup.additionalNotes && <p>
                    <b>Signup-specific Skills/Notes</b>
                    <br/>
                    {props.signup.additionalNotes}    
                </p>}

                <p><b>Requested courses:</b></p>
                <ul>
                    {props.signup.courses.map(course => {
                        return <li>
                            {props.program.courses[course].name}
                            {props.program.courses[course].duration > 1 && ` (${props.program.courses[course].duration} weeks long)`}
                        </li>
                    })}
                </ul>

                <p><b>Interested in being an instructor?</b> {props.signup.instructor ? "Yes" : "No"}</p>
                
                <form action={data => {
                    submitVolunteerAssignments(
                        data, 
                        props.program.id,
                        props.enrollment.volunteerID,
                        props.enrollment.id
                    );
                    setActive(false);
                }}>
                    <Table.Root
                        columns={[
                            "Week",
                            "Course",
                            "Instructor Access?"
                        ]}
                    >
                        {coursesPerWeek.map(week => {
                            return (
                                <Table.Row
                                    data={[
                                        <p>Week {week.week}</p>,
                                        <select 
                                            title={`Course assignment for week ${week.week}`} 
                                            name={`assignment_week${week.week}`}
                                        >
                                            {week.courses.map(course => {
                                                return (
                                                    <option value={course.id}>{course.name}</option>
                                                )
                                            })}
                                        </select>,
                                        <>
                                            <input 
                                                type="checkbox" 
                                                value="true"
                                                name={`instructor_week${week.week}`}
                                                id={`instructor_week${week.week}`}
                                                title={`Instructor interest for week ${week.week}`}
                                            />
                                            <label htmlFor={`instructor_week${week.week}`}>Yes</label>
                                        </>
                                    ]}
                                />
                                )
                        })}
                    </Table.Root>
                    <br/>
                    <button type="submit">Submit</button>
                </form>
            </Popup>
        </>
    )
}
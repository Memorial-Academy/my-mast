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
    const [data, setData] = useState<{
        week: number,
        course: number,
        instructor: boolean
    }[]>([])

    let template = [];
    for (let week = 1; week <= props.program.schedule.length; week++) {
        template.push({
            week: week,
            course: -1,
            instructor: 0
        })
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
                        return <li>{props.program.courses[course].name}</li>
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
                        {props.program.schedule.map((week, index) => {
                            if (!props.signup.weeks.includes(index + 1)) {
                                return <></>
                            }

                            return (
                                <Table.Row 
                                    data={[
                                        <p>Week {index + 1}</p>,
                                        <select 
                                            title={`Course assignment for week ${index + 1}`} 
                                            name={`assignment_week${index + 1}`}
                                        >
                                            {props.program.courses.map(course => {
                                                if (course.available.includes(index + 1)) {
                                                    return <option value={course.id}>{course.name}</option>
                                                }
                                            })}
                                        </select>,
                                        <>
                                            <input 
                                                type="checkbox" 
                                                value="true"
                                                name={`instructor_week${index + 1}`}
                                                id={`instructor_week${index + 1}`}
                                                title={`Instructor interest for week ${index + 1}`}
                                            />
                                            <label htmlFor={`instructor_week${index + 1}`}>Yes</label>
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
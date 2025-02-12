"use client"
import { useState } from "react";
import { LabelledInput, MultipleChoice } from "@mymast/ui";
import { submitVolunteerSignup, volunteerSignup } from "@/app/lib/enrollment_handler";
import { calculateHoursFromWeek } from "@/app/lib/calculate_hours";
import Link from "next/link";

type VolunteerEnrollmentPopupProps = {
    program: ProgramData
}

export default function VolunteerEnrollmentPopup(props: VolunteerEnrollmentPopupProps) {
    const [confirmation, setConfirmation] = useState("");
    const [page, setPage] = useState((props.program.courses.length == 1 && props.program.schedule.length == 1) ? 2 : 1);
    const [enrollment, setEnrollment] = useState<{
        weeks: Array<number>,
        courses: Array<number>,
        instructor: boolean
    }>((props.program.courses.length == 1 && props.program.schedule.length == 1) ? {
        weeks: [1],
        courses: [0],
        instructor: false
    } : {
        weeks: [],
        courses: [],
        instructor: false
    });

    function volunteerHours() {
        let total = 0;

        for (let week of enrollment.weeks) {
            total += calculateHoursFromWeek(props.program.schedule[week - 1]);
        }

        return total;
    }

    return (
        <>
            <form
                action={async data => {
                    setPage(2);
                    setEnrollment(await volunteerSignup(data));
                }}
                style={{
                    display: `${page == 1 ? "block" : "none"}`
                }}
            >
                {props.program.courses.length > 1 && <>
                    <p>Thanks for volunteering! Volunteers get assigned based on the number of students in each course. To best assist us in assigning you to a course that maximizes your knowledge, please complete the following questions.</p>
                    <MultipleChoice
                        question="Which course(s) are you interested in volunteering for? (select all that apply)"
                        name="course_interest"
                        type="checkbox"
                        values={
                            props.program.courses.map(course => {
                                return [course.id.toString(), course.name];
                            })
                        }
                        required
                    />
                    <p>
                        Instructors are special volunteers, chosen by the program director, who take the main resposibility for teaching a course. They'll receive instructional materials (such as presentations and documents) roughly one week before the camp begins, and are responsible for teaching those materials during the camp.
                        <br/>
                        Instructors should be passionate and reasonably knowledgable about the subjects they are teaching, work very well with children and be good at explaining things, and work well with other volunteers.
                    </p>
                    <MultipleChoice
                        question="Are you interested and/or comfortable in being an instructor?"
                        name="instructor"
                        type="radio"
                        values={[
                            ["yes", "Yes"],
                            ["no", "No"]
                        ]}
                    />
                    <p>
                        <b>Important note:</b>
                        <br/>
                        The course you are assigned to volunteer for will be decided by the program director at a later date. This assignment will be published to your MyMAST dashboard and emailed to you. We will ensure you are assigned a course for all the weeks you volunteer for.
                    </p>
                </>}

                {props.program.schedule.length > 1 &&
                    <MultipleChoice
                        question="Which week(s) are you planning to volunteer for? (select all that apply)"
                        name="weeks"
                        type="checkbox"
                        values={
                            props.program.schedule.map((week, index) => {
                                return [(index + 1).toString(), `Week ${index + 1}`];
                            })
                        }
                        required
                    />
                }
                <input type="submit" value="Next" />
            </form>
            {page == 2 &&
                <>
                    <h3>Confirm your signup</h3>
                    {props.program.courses.length > 1 && props.program.schedule.length > 1 && <p>
                        You are signing up to volunteer for week{enrollment.weeks.length > 1 ? "s" : ""}
                        &nbsp;
                        {enrollment.weeks.length > 1 ? enrollment.weeks.map((week, index) => {
                            if (enrollment.weeks.length - 1 == index) {
                                return `and ${week}`;
                            } else if (enrollment.weeks.length - 2 == index) {
                                return `${week} `;
                            } else {
                                return `${week}, `;
                            }
                        }) : enrollment.weeks[0]}
                        &nbsp;and have requested to volunteer for&nbsp;
                        {enrollment.courses.length > 1 ? enrollment.courses.map((course, index) => {
                            if (enrollment.courses.length - 1 == index) {
                                return `and ${props.program.courses[course].name}`;
                            } else if (enrollment.courses.length - 2 == index) {
                                return `${props.program.courses[course].name} `;
                            } else {
                                return `${props.program.courses[course].name}, `;
                            }
                        }) : props.program.courses[0].name}
                        .
                        <br/>
                        {enrollment.instructor && <>You have indicated you are interested in/comfortable with being an instructor. We appreciate your passion!</>}
                    </p>}
                    <p>Upon completion of this commitment, you will receive an estimated {volunteerHours()} volunteering hours.</p>
                    <form
                        action={async data => {
                            let status = await submitVolunteerSignup({
                                    weeks: enrollment.weeks,
                                    courses: enrollment.courses,
                                    instructor: enrollment.instructor,
                                    skills: data.get("skills")?.toString() || ""
                                },
                                props.program.id
                            )

                            if (status) {
                                setConfirmation("Whoops! We encountered an error processing your signup. Please make sure you're logged in and that you have no other conflicting volunteer assignments, then try again!")
                            } else {
                                setPage(3);
                            }
                        }}
                    >
                        <LabelledInput
                            question="List any of your skills, qualifications, experiences, etc. that you want us to know about! (Don't write an essay, just write a list)"
                            name="skills"
                            type="text"
                            placeholder="Brag about yourself here (optional)"
                            required={enrollment.instructor}
                        />
                        {props.program.courses.length > 1 && props.program.schedule.length > 1 && 
                            <input type="button" value="Back" onClick={() => {
                                setPage(1);
                            }} />
                        }
                        <input type="submit" value="Submit" />
                    </form>
                    <p>{confirmation}</p>
                </>
            }
            {page == 3 && <>
                <h3>All done!</h3>
                <p>Thanks for volunteering! We are thankful for your help and look forward to having you join us!</p>
                <p>
                    Make sure to frequently check your <Link href="/dashboard">MyMAST dashboard</Link> to see more information about your signup. Additionally, any information related to your signup will be emailed to you. 
                    Please note that sometimes our emails get mark as spammed, or get blocked by certain email providers. Regardless, your MyMAST dashboard will display all the necessary information about your enrollment!
                </p>
            </>}
        </>
    )
}
"use client";
import { useState } from "react";
import {  MultipleChoice } from "@mymast/ui";
import { studentEnrollment, submitStudentEnrollment } from "@/app/lib/enrollment_handler";
import Link from "next/link";
import { Program } from "@mymast/api/Types";

type StudentEnrollmentPopupProps = {
    students: Array<{
        name: {
            first: string,
            last: string,
        },
        uuid: string
    }>,
    program: Program,
    email: string
}

export default function StudentEnrollmentPopup(props: StudentEnrollmentPopupProps) {
    const [page, setPage] = useState(1);
    const [enrollmentSections, setEnrollmentSections] = useState<Array<React.ReactNode>>([]);
    const [enrollment, setEnrollment] = useState<Array<StudentEnrollmentInformation>>([]);
    const [confirmation, setConfirmation] = useState("");
    const [conflictStudent, setConflictStudent] = useState("");

    return (
        <>
            {/* FORM PAGE 1 */}
            <form 
                action={async (data) => {
                    let enrollmentInfo = await studentEnrollment(data, props.program.id);
                    if (enrollmentInfo.conflicts) {
                        props.students.forEach(student => {
                            if (student.uuid === enrollmentInfo.student) {
                                setConflictStudent(`${student.name.first} ${student.name.last}`);
                                setPage(4);
                            }
                        })
                    } else {
                        setEnrollment(enrollmentInfo.enrollmentInformation!);
                        setPage(2);
                    }
                }}
                style={{
                    display: `${page == 1 ? "block" : "none"}`
                }}
            >
                <MultipleChoice
                    question="Select the students you wish to enroll."
                    type="checkbox"
                    name="enroll_students"
                    values={props.students.map(student => {
                        return [student.uuid, `${student.name.first} ${student.name.last}`];
                    })}
                    required
                    onChange={(e, data) => {
                        let tempSections: Array<React.ReactNode> = []
            
                        data.forEach(selected => {
                            let student = props.students!.find(item => item.uuid == selected);
                            tempSections.push(
                                <StudentEnrollmentSection 
                                    name={student!.name} 
                                    uuid={student!.uuid} 
                                    key={student!.uuid}
                                    classes={props.program.courses}
                                    activeWeeks={props.program.active}
                                />
                            )
                        })

                        setEnrollmentSections(tempSections);
                    }}
                />
                {enrollmentSections}
                {enrollmentSections.length > 0 ? <input type="submit" value="Next" /> : <></>}
            </form>

            {/* FORM PAGE 2 */}
            {page == 2 && <>
                <h3>Confirm your enrollment details</h3>
                <ul>
                    {enrollment.map(info => {
                        let name = "";
                        let course = props.program.courses[info.class]
                        let schedule = props.program.schedule

                        for (var student of props.students) {
                            if (student.uuid == info.id) {
                                name = student.name.first + " " + student.name.last;
                            }
                        }

                        return <li>
                            {name} is enrolling in {props.program.courses.length > 1 ? course.name : props.program.name} during week {info.week}. 
                            The class lasts {course.duration} week{course.duration > 1 ? "s" : ""}
                            &nbsp;and begins on {schedule[info.week - 1][0].month}/{schedule[info.week - 1][0].date}/{schedule[info.week - 1][0].year}
                            &nbsp;and ends on {schedule[info.week + course.duration - 2].at(-1)!.month}/{schedule[info.week + course.duration - 2].at(-1)!.date}/{schedule[info.week + course.duration - 2].at(-1)!.year}.
                        </li>
                    })}
                </ul>

                <h3>Consider donating?</h3>
                <p>
                    While we take immense pride in offering no-cost/low-cost programs, it still costs a lot to provide these opportunities. As a nonprofit organization, we're reliant on donations and sponsorships to remain operational.
                    If you can, please consider donating to support the future of these programs; no amount is too small!
                    <br/>
                    Note: donations are completely optional and have no impact on your enrollment.
                </p>
                <p><a href="https://memorialacademy.org/donate" target="_blank" rel="noopener">Click here</a> to make a tax-deductible donation (link will open in a new tab).</p>

                <h3>Complete the Program Enrollment Agreement</h3>
                <p>
                    Before enrolling, please make sure to read and complete the Program Enrollment Agreement! <b>It is a requirement to attend a MAST program!</b>
                </p>
                <p>
                    We use a third-party service, DocuSeal, to manage our digital agreements. Visit this link (automatically opens in a new tab) to complete the agreement (it takes less than 30 seconds):&nbsp;
                    <a href={process.env.NEXT_PUBLIC_PARENT_AGREEMENT + `?email=${props.email}`} target="_blank">{process.env.NEXT_PUBLIC_PARENT_AGREEMENT}</a>.
                    <br/>
                    Then, you can complete your enrollment!
                </p>

                <input type="button" value="Back" onClick={() => {
                    setPage(1);
                }} />
                <input type="submit" value="Submit" onClick={async () => {
                    let status = await submitStudentEnrollment(enrollment, props.program.id);
                    if (status) {
                        setConfirmation("Whoops! We encountered an error processing your enrollment. Please make sure you're logged in, and that the student(s) you're enrolling have no conflicting enrollments!")
                    } else {
                        setPage(3);
                    }
                }}/>
                <p>{confirmation}</p>
            </>}

            {/* FORM PAGE 3 */}
            {page == 3 && <>
                <h3>All done!</h3>
                <p>
                    Thanks for enrolling in {props.program.name}! We're looking forward to having&nbsp;
                    {enrollment.map((enrolledStudent, index) => {
                        for (var student of props.students) {
                            if (student.uuid == enrolledStudent.id) {
                                if (index == enrollment.length - 1) {
                                    return student.name.first + " ";
                                } else if (index == enrollment.length - 2) {
                                    return student.name.first + `${enrollment.length > 2 ? ", " : " "} and `;
                                } else {
                                    return student.name.first + ", ";
                                }
                            }
                        }
                    })}
                    join us for a week of fun and learning!
                </p>
                <p>
                    Check your <a href="/dashboard">parent dashboard</a> to see more information about this enrollment. Additionally, you should receive a confirmation email in a few minutes. Please note that sometimes our emails get mark as spammed, or get blocked by certain email providers. Regardless, your MyMAST parent dashboard will display all the necessary information about your enrollment!
                </p>
            </>}

            {/* PAGE 4 (only displayed when conflicts are present) */}
            {page == 4 && <>
                <h3>Whoops! We detected a problem!</h3>
                <p>It looks like {conflictStudent} is already enrolled for a program during some or all of the dates you selected. Try going back to select a different time period, and visit your <Link href="/dashboard">dashboard</Link> to see your current enrollments!</p>
                <input type="button" value="Back" onClick={() => {
                    setPage(1);
                }} />
            </>}
        </>
    )
}

type StudentEnrollmentSectionProps = {
    name: {
        first: string,
        last: string
    },
    uuid: string,
    classes: Array<Course>,
    activeWeeks: Array<boolean>
}

function StudentEnrollmentSection(props: StudentEnrollmentSectionProps) {
    const [course, setCourse] = useState(props.classes.length > 1 ? -1 : 0);    // automatically select course 0 if there is only one class in the program

    return (
        <>
            <h3>Enrollment Information for {props.name.first} {props.name.last}</h3>
            {props.classes.length > 1 ? <>
                <MultipleChoice
                    question="Please select the class you wish to enroll in."
                    name={`${props.uuid}_class`}
                    type="radio"
                    values={props.classes.map((course, index) => {
                        return [index.toString(), course.name];
                    })}
                    onChange={(e, data) => {
                        setCourse(parseInt(data[0]));
                    }}
                    required
                />
                <p>Trying to enroll one student in multiple classes? You can only enroll a student in one class at a time; complete this form multiple times to enroll a student in more than one class.</p>
                
            </> : <>
                {/* Placeholder input element for single course programs. When the form is submitted, this automatically enrolls the student in the default course */}
                <input type="hidden" name={`${props.uuid}_class`} value={0} />
            </>}
            {(course > -1 || props.classes.length == 1) && <>
                <MultipleChoice
                    question={`Please select the week you wish to attend${props.classes[course].duration > 1 ? ` (note: this is a ${props.classes[course].duration} week long course)` : ""}.`}
                    name={`${props.uuid}_week`}
                    type="radio"
                    values={props.classes[course].available.map(val => {
                        return [val.toString(), `Week ${val} ${!props.activeWeeks[val - 1] ? "(Signups for this week are closed!)" : ""}`, !props.activeWeeks[val - 1]];
                    })}
                    required
                />
            </>}
        </>
    )
}
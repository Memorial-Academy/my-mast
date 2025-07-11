import calculateAge from "@mymast/utils/birthday";
import { Table } from "@mymast/ui";
import authorizeSession from "@mymast/utils/authorize_session";
import ManageStudentPopup from "@/components/program_manager/ManageStudentPopup";
import API from "@/app/lib/APIHandler";
import generateProgramManagerMetadata, { ParamsArgument } from "../../generate_metadata";

export const generateMetadata = generateProgramManagerMetadata("Students");

export default async function Page({params}: ParamsArgument) {
    const data = await API.Application.getProgram((await params).id);

    const auth = (await authorizeSession())!;

    // get student enrollment info
    const enrollmentData = await API.Admin.getEnrolledStudents(auth.uuid, auth.token, data.id)

    let enrollmentTotal = 0;

    for (var course of enrollmentData) {
        enrollmentTotal += course.total;
    }

    return (
        <>
            <h2>Student enrollment for {data.name}</h2>
            <p>Total enrollments: {enrollmentTotal}</p>

            {/* Create sections for each course */}
            {enrollmentData.map(course => {
                return (
                    <section key={course.courseID} className="enrollment-section" >
                        <h3>Enrolled in "{data.courses[course.courseID].name}"</h3>
                        {data.courses.length == 1 && <p>
                            <b>This is the only course in this program.</b>
                            &nbsp;Students will automatically be enrolled in this program.
                        </p>}
                        <p>Course enrollments: {course.total}</p>

                        {/* Generate weekly sections */}
                        {course.data.map((week, index) => {
                            return <>
                                <h4>Week {week.week}{data.courses[course.courseID].duration > 1 && ` thru ${data.courses[course.courseID].duration + week.week - 1}`}</h4>
                                {data.courses[course.courseID].available.length == 1 && <p>
                                    <b>This course is only available during this week.</b>
                                    &nbsp;Students will automatically be enrolled in this week.
                                </p>}
                                <p>Enrollments: {week.enrollments.length}</p>
                                
                                <Table.Root columns={[
                                    "Name",
                                    "Birthday / Age",
                                    "Parent Name",
                                    "Parent Email",
                                    "Parent Phone",
                                    ""
                                ]}>
                                    {/* Individual rows for each student */}
                                    {week.enrollments.map(student => {
                                        let birthday = calculateAge(student.student.birthday);

                                        return <Table.Row data={[
                                            `${student.student.name.first} ${student.student.name.last}`,
                                            `${birthday.birthdayString} (${birthday.years} years and ${birthday.months} months old)`,
                                            `${student.parent.name.first} ${student.parent.name.last}`,
                                            student.parent.email,
                                            student.parent.phone,
                                            <ManageStudentPopup 
                                                notes={student.student.notes}
                                                name={student.student.name}
                                                parentName={student.parent.name}
                                                parentContact={{
                                                    email: student.parent.email,
                                                    phone: student.parent.phone
                                                }}
                                                enrollmentID={student.enrollmentID}
                                                courseName={data.courses[course.courseID].name}
                                                week={week.week}
                                                program={data.id}
                                                auth={auth}
                                                emergencyContact={student.parent.emergencyContact}
                                            />
                                        ]}
                                        key={`${student.student.name.first} ${student.student.name.last}`}
                                        />
                                    })}
                                </Table.Root>

                            </>
                        })}
                    </section>
                )
            })}
        </>
    )
}
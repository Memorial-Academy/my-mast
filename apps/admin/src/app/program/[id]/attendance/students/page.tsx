import StudentAttendanceCheckbox from "@/components/program_manager/attendance/StudentCheckbox";
import generateProgramManagerMetadata, { ParamsArgument } from "../../generate_metadata";
import API from "@/app/lib/APIHandler";
import { Table } from "@mymast/ui";
import sessionInfo from "@mymast/utils/authorize_session";
import { getFullName, shortDateString } from "@mymast/utils/string_helpers";
import { ReactNode } from "react";

export const generateMetadata = generateProgramManagerMetadata("Student Attendance");

export default async function Page({params}: ParamsArgument) {
    const program = await API.Application.getProgram((await params).id);
    const auth = (await sessionInfo())!;
    const signups = await API.Admin.getEnrolledStudents(
        auth.uuid,
        auth.token,
        program.id
    )

    let sortedSignups = new Array<ReactNode[]>(program.schedule.length);    // an array of ReactNodes for each week, contained in a single array

    for (var courseSignups of signups) {
        let course = program.courses[courseSignups.courseID];
        for (var weekSignups of courseSignups.data) {
            let weekIndex = weekSignups.week - 1;
            let weekSchedule = program.schedule[weekIndex];
            for (var w = weekIndex; w < course.duration + weekIndex; w++) {
                if (!sortedSignups[weekIndex]) {
                    sortedSignups[weekIndex] = [];
                }
            }

            for (var signup of weekSignups.enrollments) {
                let attendanceStatus = await API.Admin.attendance.checkStudentStatus(
                    auth.uuid,
                    auth.token,
                    program.id,
                    signup.student.uuid,
                    weekSignups.week
                )

                let data: (string | ReactNode)[] = [
                    getFullName(signup.student.name),
                    course.name
                ];
                data = data.concat(attendanceStatus.map((status, index) => {
                    return <StudentAttendanceCheckbox 
                        key={shortDateString(weekSchedule[index])}
                        auth={auth}
                        program={program.id}
                        student={signup.student.uuid}
                        day={{
                            date: weekSchedule[index].date,
                            month: weekSchedule[index].month,
                            year: weekSchedule[index].year,
                        }}
                        status={status}
                    />
                }));

                sortedSignups[weekIndex].push(
                    <Table.Row key={getFullName(signup.student.name)} data={data}/>
                )
            }
        }
    }

    return (
        <>
            <h2>Student Attendance for "{program.name}"</h2>
            {program.schedule.map((week, index) => {
                let columns = ["Name", "Course"];

                for (var day of program.schedule[index]) {
                    columns.push(shortDateString(day));
                }

                return (
                    <section className="enrollment-section">
                        <h3>Week {index + 1}</h3>
                        <Table.Root columns={columns}>
                            {sortedSignups[index]}
                        </Table.Root>
                    </section>
                )
            })}
        </>
    )
}
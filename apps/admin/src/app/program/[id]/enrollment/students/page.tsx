import { calculateAge } from "@mymast/utils/birthday";
import getProgramData from "@/app/lib/get_program_data";
import { Table } from "@mymast/ui";
import authorizeSession from "@mymast/utils/authorize_session";
import StudentNotesPopup from "@/components/program_manager/StudentNotesPopup";

type Params = Promise<{
    id: string
}>

export async function generateMetadata({params}: {params: Params}) {
    const data = await getProgramData((await params).id);

    return {
        title: `Enrolled Students - ${data.name} - Program Manager | Admin Control Panel | Memorial Academy of Science and Technology`
    }
}

export default async function Page({params}: {params: Params}) {
    const data = await getProgramData((await params).id);
    const auth = (await authorizeSession())!;

    // get student enrollment data
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/enrollments/students`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uuid: auth.uuid,
            token: auth.token,
            program: data.id
        })
    })

    const enrollmentData: Array<{
        courseID: number,
        total: number,
        data: Array<{
            week: number,
            enrollments: Array<{
                student: Student,
                parent: Parent
            }>
        }>
    }> = await req.json();

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
                    <section key={course.courseID}>
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
                                    "Notes"
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
                                            <>
                                                <StudentNotesPopup 
                                                    notes={student.student.notes}
                                                    name={student.student.name}
                                                    parentName={student.parent.name}
                                                    parentContact={{
                                                        email: student.parent.email,
                                                        phone: student.parent.phone
                                                    }}
                                                />
                                            </>
                                        ]}/>
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
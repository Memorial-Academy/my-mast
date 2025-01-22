import { calculateAge } from "@mymast/utils/birthday";
import getProgramData from "@/app/lib/get_program_data";
import { Table } from "@mymast/ui";
import authorizeSession from "@mymast/utils/authorize_session";

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
                        <p>Course enrollments: {course.total}</p>

                        {/* Generate weekly sections */}
                        {course.data.map((week, index) => {
                            return <>
                                <h4>Week {week.week}</h4>
                                <p>Enrollments: {week.enrollments.length}</p>

                                <Table.Root columns={[
                                    "Name",
                                    "Birthday / Age",
                                    "Parent Name",
                                    "Parent Email",
                                    "Parent Phone"
                                ]}>
                                    {week.enrollments.map(student => {
                                        let birthday = calculateAge(student.student.birthday);

                                        return <Table.Row data={[
                                            `${student.student.name.first} ${student.student.name.last}`,
                                            `${birthday.birthdayString} (${birthday.years} years and ${birthday.months} months old)`,
                                            `${student.parent.name.first} ${student.parent.name.last}`,
                                            student.parent.email,
                                            student.parent.phone
                                        ]}/>
                                    })}
                                </Table.Root>
                            </>
                        })}

                        {/* Generate individual enrollment 
                        {data.enrollments.students.length > 0 && courseEnrollments[course.id!].map(enrollment => {
                            let student = enrollment.student;
                            let age = calculateAge(student.birthday)
                    
                            return (
                                <Card 
                                    key={student.uuid}
                                    header={`${student.name.first} ${student.name.last}`}
                                >
                                    <div className="bi-fold">
                                        <div>
                                            <p>
                                                <b>Attending Week {enrollment.week}</b>
                                            </p>
                                            <p>
                                                Birthday: {age.birthdayString} ({age.years} years  and {age.months} months old)
                                            </p>
                                            <p>
                                                <b>Additional Info:</b>
                                                <br/>
                                                {student.notes || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <b>Parent Name:</b>&nbsp;
                                                {enrollment.parent.name.first} {enrollment.parent.name.last}
                                            </p>
                                            <p>
                                                <b>Parent Email:</b>&nbsp;
                                                {enrollment.parent.email}
                                            </p>
                                            <p>
                                                <b>Parent Phone:</b>&nbsp;
                                                {enrollment.parent.phone}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })} */}
                    </section>
                )
            })}
        </>
    )
}
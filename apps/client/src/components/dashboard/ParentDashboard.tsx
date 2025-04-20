import API from "@/app/lib/APIHandler"
import EnrollmentCard from "./EnrollmentCard"

type ParentDashboardProps = {
    uuid: string    // parent uuid
    token: string   // parent auth token
}

export default async function ParentDashboard(props: ParentDashboardProps) {
    const students = await API.User.parentGetStudents(props.uuid, props.token);

    return (
        <>
            <p>Your MyMAST dashboard allows you to see everything related to your student's enrollments. Missed an email? Need to change enrollment information? All the information you need is right here!</p>
            <h2>Your Students</h2>
            {students.map(student => {
                return (
                    <div className="" key={student.uuid}>
                        <h3>{student.name.first}'s Enrollments</h3>
                        {student.enrollments.length > 0 ? student.enrollments.map(async (enrollment, index) => {
                            const program = await API.Application.getProgram(enrollment.program);

                            return (
                                <EnrollmentCard
                                    key={`${student.name.first}_${index}`}
                                    program={program}
                                    course={program.courses[enrollment.course]}
                                    week={enrollment.week}
                                    studentName={`${student.name.first} ${student.name.last}`}
                                    enrollmentID={enrollment.id}
                                />
                            )
                        }) : <p>{student.name.first} is currently not enrolled in any programs. <a href="/programs">Get enrolled in some programs today!</a></p>}
                    </div>
                )
            })}
        </>
    )
}
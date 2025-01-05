import EnrollmentCard from "./EnrollmentCard"

type ParentDashboardProps = {
    uuid: string
    token: string
}

export default async function ParentDashboard(props: ParentDashboardProps) {
    const students: Array<Student> = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/parent/students`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uuid: props.uuid,
            token: props.token,
        })
    })).json()

    return (
        <>
            <p>Your MyMAST dashboard allows you to see everything related to your student's enrollments. Missed an email? Trying to change your enrollment information? All the information you need is right here!</p>
            <h2>Your Students</h2>
            {students.map(student => {
                return (
                    <div className="" key={student.uuid}>
                        <h3>{student.name.first}'s Enrollments</h3>
                        {student.enrollments.length > 0 ? student.enrollments.map(async (enrollment, index) => {
                            const program: ProgramData = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/program/${enrollment.program}`)).json()

                            return (
                                <EnrollmentCard
                                    key={`${student.name.first}_${index}`}
                                    program={program}
                                    course={program.courses[enrollment.course]}
                                    week={enrollment.week}
                                    type="parent"
                                />
                            )
                        }) : <p>{student.name.first} is currently not enrolled in any programs. <a href="/programs">Get enrolled in some programs today!</a></p>}
                    </div>
                )
            })}
        </>
    )
}
import API from "@/app/lib/APIHandler"
import EnrollmentCard from "./EnrollmentCard"
import { EmailLink } from "@mymast/ui"

type ParentDashboardProps = {
    uuid: string    // parent uuid
    token: string   // parent auth token
}

export default async function ParentDashboard(props: ParentDashboardProps) {
    const students = await API.User.parentGetStudents(props.uuid, props.token);



    return (
        <>
            <p>Your MyMAST dashboard allows you to see everything related to your student's enrollments. Missed an email? Got a question? All the information you need is right here!</p>
            <h2>Your Students</h2>
            {students.map(student => {
                let validEnrollments = student.enrollments.map(async (enrollment, index) => {
                    const program = await API.Application.getProgram(enrollment.program);

                    let lastDateObj = program.schedule.at(-1)!.at(-1)!
                    let lastDate = new Date(`${lastDateObj.month}/${lastDateObj.date}/${lastDateObj.year}`).valueOf();
                    // assingments become invisible after 180 days, or 15552000000 milliseconds
                    // 180 days * 24 hrs * 60 mins * 60 seconds * 1000 ms
                    if (lastDate + 15552000000 <= Date.now()) {
                        return <></>;
                    }

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
                })

                return (
                    <div className="" key={student.uuid}>
                        <h3>{student.name.first}'s Enrollments</h3>
                        {student.enrollments.length > 0 ? validEnrollments.map(enrollment => {
                            return enrollment;
                        }) : <p>{student.name.first} is currently not enrolled in any programs. <a href="/programs">Get enrolled in some programs today!</a></p>}
                    </div>
                )
            })}
            <p>Looking for a program you previously signed up for? Only programs that ended within the past 180 days are displayed here. Please contact us at <EmailLink email="hello@memorialacademy.org" subject="Question Regarding Previous Program - <put the program name here>" /> if you have questions about past programs!</p>
            
        </>
    )
}
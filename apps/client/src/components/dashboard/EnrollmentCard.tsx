import { Card, ConfirmationPopup } from "@mymast/ui";
import EnrollmentCardSchedule from "./EnrollmentCardSchedule"
import { Program } from "@mymast/api/Types";

type EnrollmentCardProps = {
    program: Program,
    course: Course,
    week: number,
    studentName: string,
    enrollmentID: string
}

export default function EnrollmentCard({ program, course, week, studentName, enrollmentID }: EnrollmentCardProps) {
    return (
        <>
            <Card 
                header={program.name}
                // actionElement={
                //     <ConfirmationPopup 
                //         buttonText="Unenroll"
                //         message={`You are about to unenroll ${studentName} from ${program.name}. They will immediately be removed from this program. If you decide you would still like to have your student attend this program, you will have re-enroll them. Are you sure you want to continue?`}
                //         callback={async () => {
                //             "use server";
                //             console.log(enrollmentID);
                //         }}
                //     />
                // }
            >
                <div className="tri-fold">
                    {/* Basic course info */}
                    <div>
                        {program.courses.length > 1 ? <p><b>Course:</b> {course.name}</p> : <></>}
                        <p>
                            <b>Location:</b>&nbsp;
                            {program.location.loc_type == "physical" ? 
                                <>
                                    {program.location.common_name}
                                    <br/>
                                    {program.location.address}
                                    <br/>
                                    {program.location.city}, {program.location.state} {program.location.zip}
                                </>
                            : "Virtual (links will be sent out at a later date)"}
                        </p>
                    </div>
                    {/* Schedule */}
                    <div>
                        <p><b>Attending: </b> {course.duration > 1 ?
                            `Weeks ${week} - ${week + course.duration - 1}` : `Week ${week}`
                        }</p>
                        <EnrollmentCardSchedule 
                            course={course}
                            program={program}
                            week={week}
                        />
                    </div>
                    {/* Contact */}
                    <p>
                        <b>Questions?</b> Contact the program director, {program.contact.name.first} {program.contact.name.last}!
                        <br/>
                        Email: <a href={`mailto:${program.contact.email}`}>{program.contact.email}</a>
                        <br/>
                        Phone: <a href={`tel:${program.contact.phone}`}>{program.contact.phone}</a>
                    </p>
                </div>
            </Card>
        </>
    )
}
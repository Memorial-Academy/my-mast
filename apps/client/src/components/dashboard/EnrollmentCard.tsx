import { Card } from "@mymast/ui";
import EnrollmentCardSchedule from "./EnrollmentCardSchedule"
import { Program } from "@mymast/api/Types";

type EnrollmentCardProps = {
    program: Program,
    course: Course,
    week: number
}

export default function EnrollmentCard({ program, course, week }: EnrollmentCardProps) {
    return (
        <>
            <Card 
                header={program.name}
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
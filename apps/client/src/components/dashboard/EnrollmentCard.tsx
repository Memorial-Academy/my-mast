import { Card, EmailLink, PhoneNumberLink, VirtualProgramLink } from "@mymast/ui";
import EnrollmentCardSchedule from "./EnrollmentCardSchedule"
import { Program } from "@mymast/api/Types";
import MYMAST_URL from "@mymast/utils/urls";
import Link from "next/link";

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
                            : <>
                                Virtual
                                <br/>
                                Join here: <VirtualProgramLink programID={program.id} />
                                <br/>
                                Please note: you must be logged into your MyMAST account to access this link, otherwise you will be asked to log-in!
                            </>}
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
                        Email: <EmailLink email={program.contact.email}/>
                        <br/>
                        Phone: <PhoneNumberLink phoneNumber={program.contact.phone}/>
                    </p>
                </div>
            </Card>
        </>
    )
}
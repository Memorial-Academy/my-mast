"use client";
import { Card } from "@mymast/ui";
import EnrollmentCardSchedule from "./EnrollmentCardSchedule"
import { Popup } from "@mymast/ui";
import { useState } from "react";

type EnrollmentCardProps = {
    program: ProgramData,
    course: Course,
    week: number,
    type: "volunteer" | "parent"
}

export default function EnrollmentCard({
    program, course, week, type
}: EnrollmentCardProps) {
    const [popupActive, setPopupActive] = useState(false);
    
    return (
        <>
            <Card 
                header={program.name}
                actionLink={{
                    text: "Manage enrollment ->",
                    onClick: () => {
                        setPopupActive(true);
                    }
                }}
            >
                <div className="bi-fold">
                    <div>
                        {program.courses.length > 1 ? <p><b>Course:</b> {course.name}</p> : <></>}
                        <p><b>Location:</b> {program.location.loc_type == "physical" ? program.location.common_name : "Virtual (links will be sent out at a later date)"}</p>
                    </div>
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
                </div>
            </Card>
            <Popup
                active={popupActive}
                onClose={() => {
                    setPopupActive(false);
                }}
            >
                <p>WIP</p>
            </Popup>
        </>
    )
}
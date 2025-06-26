"use client";
import API from "@/app/lib/APIHandler";
import { Session } from "@mymast/api/Types";
import { ConfirmationPopup, Popup } from "@mymast/ui";
import { Suspense, useState } from "react";
import { VolunteerCheckInStatus } from "./attendance/VolunteerAttendanceStatus";
import AddVolunteerHours from "./attendance/AddVolunteerHours";
import ManageVolunteerHours from "./attendance/ManageVolunteerHours";

type ManageVolunteerPopupProps = {
    name: string,
    notes: string,
    signupNotes?: string,
    enrollmentID: string,
    auth: Session,
    program: {
        id: string,
        name: string
    }
    volunteer_id: string
}

export default function ManageVolunteerPopup(props: ManageVolunteerPopupProps) {
    const [active, setActive] = useState(false);

    return (
        <>
            <a 
                href="#"
                onClick={e => {
                    e.preventDefault();
                    setActive(true);
                }}
            >Manage volunteer</a>
            <Popup
                active={active}
                onClose={() => {
                    setActive(false);
                }}
            >
                <h2>Manage volunteer: {props.name}</h2>
                <div className="bi-fold">
                    <p>
                        <b>Skills/notes</b>
                        <br/>
                        {props.notes}
                    </p>
                    {props.signupNotes && <p>
                        <b>Signup-specific skills/notes</b>
                        <br/>
                        {props.signupNotes}
                    </p>}
                </div>

                <h2>Options</h2>
                <h3>Attendance</h3>
                <Suspense fallback={<p>Loading volunteer check-in...</p>}>
                    <VolunteerCheckInStatus
                        program={props.program}
                        auth={props.auth}
                        volunteer={{
                            fullName: props.name,
                            uuid: props.volunteer_id
                        }}
                    />
                </Suspense>
                <AddVolunteerHours
                    program={props.program}
                    auth={props.auth}
                    volunteer={{
                        fullName: props.name,
                        uuid: props.volunteer_id
                    }}
                />
                <ManageVolunteerHours
                    program={props.program}
                    auth={props.auth}
                    volunteer={{
                        fullName: props.name,
                        uuid: props.volunteer_id
                    }}
                />
                <h3>Danger Zone</h3>
                <ConfirmationPopup
                    buttonText="Delete signup"
                    message={`You are about to delete ${props.name}'s volunteering signup for ${props.program.name}. This will permanently remove them from all assignments within this program. They will have to signup again if they wish to participate. Are you sure you want to do this?`}
                    callback={async () => {
                        await API.Admin.unenrollVolunteer(
                            props.auth.uuid,
                            props.auth.token,
                            props.program.id,
                            props.enrollmentID
                        )
                    }}
                    reload
                    buttonStyle="button"
                />
            </Popup>
        </>
    )
}
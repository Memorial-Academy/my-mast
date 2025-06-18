"use client";
import { useState } from "react";
import { EmailLink, PhoneNumberLink, Popup } from "@mymast/ui";

interface VolunteerCheckInConflictProps {
    volunteerName: string
    conflictProgramName: string,
    contact: {
        email: string,
        phone: string
    }
}

export default function VolunteerCheckInConflict({conflictProgramName, contact, volunteerName}: VolunteerCheckInConflictProps) {
    const [popupActive, setPopupActive] = useState(false);

    return (
        <>
            <p>
                This volunteer is already checked into another program and therefore cannot be checked-in here.&nbsp;
                <a href="#" role="button" onClick={(e) => {
                    e.preventDefault();
                    setPopupActive(true);
                }}>View details</a>
            </p>
            <Popup active={popupActive} onClose={() => {setPopupActive(false)}}>
                <h2>Volunteer Check-in Conflict!</h2>
                <p>Volunteer {volunteerName} is currently checked into the program "{conflictProgramName}." Volunteers can only be checked into one program at a time. The Program Director for {conflictProgramName} must check out {volunteerName} before you can check them into this program.</p>
                <h3>Contact Details for the Program Director of {conflictProgramName}</h3>
                <p>
                    If this conflict is causing problems with the attendance/hour tracking of your program, please use the contact details below to contact the Program Director of {conflictProgramName}.
                    <br/>
                    <b>Email:</b> <EmailLink email={contact.email} />
                    <br/>
                    <b>Phone:</b> <PhoneNumberLink phoneNumber={contact.phone} />
                </p>
                <p><b>Before doing this, try:</b></p>
                <ul>
                    <li>Refreshing the page to update all the attendance data.</li>
                    <li>Waiting a few minutes, incase the program director is already in the process of checking-out volunteers.</li>
                </ul>
                <p><b>Do not ask the volunteer to "fix" this conflict.</b> Volunteers can only be checked-in/out of a program by a Program Director/admin. Volunteers cannot fix check-in conflicts by themselves.</p>
            </Popup>
        </>
    )
}
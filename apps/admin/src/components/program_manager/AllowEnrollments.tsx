"use client";
import API from "@/app/lib/APIHandler";
import revalidateProgramPageCache from "@/app/lib/revalidate_program";
import { Session } from "@mymast/api/Types";
import { Popup } from "@mymast/ui";
import { useState } from "react";

type AllowEnrollmentControlsProps = {
    week: number,
    active: boolean,
    program: {
        name: string,
        id: string
    },
    auth: Session
}

export default function AllowEnrollmentControls({week, active, program, auth}: AllowEnrollmentControlsProps) {
    const [popupActive, setPopupActive] = useState(false);
    const [checkboxActive, setCheckboxActive] = useState(active);

    return (
        <>
            <input 
                type="checkbox"
                value="active"
                title="Allow new enrollments?"
                id={`week${week}_active`}
                checked={checkboxActive}
                onChange={(e) => {
                    e.preventDefault();
                    setPopupActive(true);
                }}
            />
            <label htmlFor={`week${week}_active`}>Allow new enrollments</label>
            <Popup active={popupActive} onClose={() => {setPopupActive(false)}}>
                <h2>Please confirm!</h2>
                <p>You are {checkboxActive ? "disabling" : "enabling"} new enrollments for week {week} of {program.name}. Parents and volunteers will {checkboxActive ? "no longer" : "now"} be able to create new enrollments in this week. This will not effect current signups or other functionality.</p>
                <p>Signups can easily be {checkboxActive ? "enabled" : "disabled"} again by toggling the "Allow new enrollments" setting on this page.</p>
                <button onClick={async () => {
                    let res = API.Admin.toggleNewEnrollments(
                        auth.uuid,
                        auth.token,
                        program.id,
                        week,
                        !checkboxActive
                    )
                    res.finally(() => {
                        setCheckboxActive(!checkboxActive);
                        revalidateProgramPageCache(program.id);
                        setPopupActive(false);
                    })
                    res.catch(() => {
                        throw "Could not change the allowance of new enrollments.";
                    })
                }}>Confirm</button>
                <button onClick={() => {setPopupActive(false)}}>Cancel</button>
            </Popup>
        </>
    )
}
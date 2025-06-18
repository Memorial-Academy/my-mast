"use client";
import { VolunteerAttendanceCheckInProps } from "./VolunteerAttendanceStatus";
import { useState } from "react";
import { LabelledInput, Popup } from "@mymast/ui";
import API from "@/app/lib/APIHandler";
import { convert24hrTimestamp } from "@mymast/utils/convert_timestamp";
import { useRouter } from "next/navigation";
import { leadingZero } from "@mymast/utils/string_helpers";

export default function VolunteerCheckIn({program, volunteer, auth}: VolunteerAttendanceCheckInProps) {
    const [popupActive, setPopupActive] = useState(false);
    let [currentDate, setCurrentDate] = useState(new Date());
    const router = useRouter();

    return (
        <>
            <button type="button" onClick={() => {
                setCurrentDate(new Date());
                setPopupActive(true);
            }}>Check-in</button>
            <Popup
                active={popupActive}
                onClose={() => {setPopupActive(false)}}
            >
                <h2>Finalize check-in</h2>
                <p>You are about to check-in volunteer {volunteer.fullName} into the program {program.name}.</p>
                <p>Below is the start date/time for the check-in. Only the time can be adjusted.</p>
                <form action={(data: FormData) => {
                    let time = convert24hrTimestamp(data.get("time")!.toString())
                    let submission = API.Admin.attendance.checkInVolunteer(
                        auth.uuid,
                        auth.token,
                        program.id,
                        volunteer.uuid,
                        {
                            date: currentDate.getDate(),
                            year: currentDate.getFullYear(),
                            month: currentDate.getMonth()
                        },
                        time
                    )

                    submission.then(() => {
                        router.refresh();
                        setPopupActive(false);
                    })
                }}>
                    <p>
                        <b>Date:</b> {currentDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                    })}</p>
                    <LabelledInput
                        question="Start Time"
                        name="time"
                        type="time"
                        required
                        defaultValue={leadingZero(currentDate.getHours()) + ":" + leadingZero(currentDate.getMinutes())}
                    />
                    <input type="submit" value="Check-in" />
                </form>
                <p>
                    <b>Please remember that volunteering sessions can only last for one calendar day and are not automatically ended.</b>
                    &nbsp;Please check-out the volunteer when they are done volunteering. Failure to do so may prevent them from being checked-in at other programs and could create inaccurate hours.
                </p>
            </Popup>
        </>
    )
}
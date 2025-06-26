"use client";
import { useState } from "react";
import { VolunteerAttendanceCheckInProps } from "./VolunteerAttendanceStatus";
import { useRouter } from "next/navigation";
import { LabelledInput, Popup } from "@mymast/ui";
import getTimestamp, { calculateTimeDifference, convert24hrTimestamp } from "@mymast/utils/convert_timestamp";
import { leadingZero } from "@mymast/utils/string_helpers";
import API from "@/app/lib/APIHandler";

interface VolunteerCheckoutProps extends VolunteerAttendanceCheckInProps {
    checkInTime: number
}

export default function VolunteerCheckOut({program, volunteer, auth, checkInTime}: VolunteerCheckoutProps) {
    const [popupActive, setPopupActive] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [endTime, setEndTime] = useState(convert24hrTimestamp( leadingZero(currentDate.getHours()) + ":" + leadingZero(currentDate.getMinutes()) ));
    const [totalHours, setTotalHours] = useState(calculateTimeDifference(checkInTime, endTime));
    const router = useRouter();

    return (
        <>
            <button type="button" onClick={() => {
                setCurrentDate(new Date());
                setPopupActive(true);
            }}>Check-out</button>
            <Popup
                active={popupActive}
                persist={false}
                onClose={() => {setPopupActive(false)}}
            >
                <h2>Please confirm!</h2>
                <p>You are about to check-out volunteer {volunteer.fullName} from the program {program.name}. This will end their current volunteering session.</p>
                <p>They were checked-in at {getTimestamp(checkInTime)}. Please confirm the check-out time below (volunteers must be checked-out on the same day they are checked-in).</p>
                <form action={(data: FormData) => {
                    let endTimeInt = convert24hrTimestamp(data.get("time")!.toString());
                    let note = data.get("note")?.toString();

                    if (endTimeInt <= checkInTime) {
                        setEndTime(0);
                        alert("We encountered an error! Please make sure the end time you've selected is later than the check-in time!")
                        return;
                    }

                    API.Admin.attendance.checkOutVolunteer(
                        auth.uuid,
                        auth.token,
                        program.id,
                        volunteer.uuid,
                        endTimeInt,
                        note
                    ).then(() => {
                        router.refresh();
                        setPopupActive(false);
                    })
                }}>
                    <LabelledInput 
                        question="End Time"
                        name="time"
                        type="time"
                        required
                        defaultValue={leadingZero(currentDate.getHours()) + ":" + leadingZero(currentDate.getMinutes())}
                        onChange={(e) => {
                            let endTimeInt = convert24hrTimestamp(e.target.value);
                            if (endTimeInt <= checkInTime) {
                                setEndTime(0);
                                return;
                            }
                            setEndTime(endTimeInt);
                            setTotalHours(calculateTimeDifference(checkInTime, endTimeInt))
                        }}
                    />
                    {endTime != 0 ? <p>
                        <b>Check-in time:</b> {getTimestamp(checkInTime)}
                        <br/>
                        <b>Check-out time:</b> {getTimestamp(endTime)}
                        <br/>
                        <b>Total hours:</b> {totalHours} hours
                        ({Math.floor(totalHours)} hour{Math.floor(totalHours) == 1 ? "" : "s"} and {Math.round((totalHours - Math.floor(totalHours)) * 60)} minutes)
                    </p> : <p>
                        <b>Please enter a valid end time!</b> End times must be after the start time.
                    </p>}
                    <LabelledInput 
                        question="Note/description of volunteering work"
                        name="note"
                        type="text"
                        placeholder="(optional)"
                    />
                    <input type="submit" value="Check-out" />
                </form>
            </Popup>
        </>
    )
}
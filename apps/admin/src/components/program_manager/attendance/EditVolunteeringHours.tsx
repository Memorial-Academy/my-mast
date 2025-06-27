"use client";
import { Popup } from "@mymast/ui";
import { useState } from "react";
import { VolunteerAttendanceCheckInProps } from "./VolunteerAttendanceStatus";
import { AbridgedVolunteerAttendanceRecord, FetchError } from "@mymast/api/Types";
import { LabelledInput } from "@mymast/ui";
import { dateObjectToFormDate, formDateToDateObject, longDateString } from "@mymast/utils/string_helpers";
import { calculateTimeDifference, convert24hrTimestamp, get24hrTimestamp } from "@mymast/utils/convert_timestamp";
import { useRouter } from "next/navigation";
import API from "@/app/lib/APIHandler";

interface EditVolunteeringHoursProps extends VolunteerAttendanceCheckInProps {
    record: AbridgedVolunteerAttendanceRecord
}

export default function EditVolunteeringHours({volunteer, auth, program, record}: EditVolunteeringHoursProps) {
    const [popupActive, setPopupActive] = useState(false);
    const [totalHours, setTotalHours] = useState(record.hours);
    const [date, setDate] = useState(longDateString(record.date));
    const router = useRouter();

    function processFormData(data: FormData, submit?: boolean) {
        // most of this code comes from processFormData in AddVolunteerHours
        let formDate = data.get("date")?.toString();
        let times = {
            start: data.get("start_time")?.toString(),
            end: data.get("end_time")?.toString()
        }

        if (times.end && times.start) {
            if (times.end <= times.start) {
                alert("The end time must be after the start time!");
                return;
            }

            setTotalHours( calculateTimeDifference(convert24hrTimestamp(times.start), convert24hrTimestamp(times.end)) );
        } else if (submit) {
            alert("Please enter valid start and end times!")
            return;
        }

        if (formDate) {
            setDate( longDateString(formDateToDateObject(formDate)) );
        } else if (submit) {
            alert("Please enter a date!");
            return;
        }

        if (submit) {
            API.Admin.attendance.editVolunteeringHours(
                auth.uuid,
                auth.token,
                program.id,
                volunteer.uuid,
                {
                    date: record.date,
                    startTime: record.startTime,
                    endTime: record.endTime
                }, {
                    date: formDateToDateObject(formDate!),
                    startTime: convert24hrTimestamp(times.start!),
                    endTime: convert24hrTimestamp(times.end!),
                    note: data.get("note")?.toString()
                }
            ).then(() => {
                router.refresh();
                setPopupActive(false);
            }).catch((res: FetchError) => {
                if (res.code == 409) {
                    alert("This volunteer has already been rewarded hours for some time during the selected date and time range. No new hours will be rewarded.")
                }
            })
        }
    }

    return (
        <>
            <a href="#" role="button" onClick={e => {
                e.preventDefault();
                setPopupActive(true);
            }}>Edit record</a>
            <Popup active={popupActive} onClose={() => {setPopupActive(false)}} persist={false}>
                <h2>Edit volunteering record for {volunteer.fullName}</h2>
                <p><b>Program:</b> {program.name}</p>
                <form action={data => {
                    processFormData(data, true)
                }} onChange={e => {
                    processFormData(new FormData(e.currentTarget), false);
                }}>
                    <div className="tri-fold">
                        <LabelledInput
                            question="Date"
                            type="date"
                            name="date"
                            defaultValue={dateObjectToFormDate(record.date)}
                        />
                        <LabelledInput
                            question="Start Time" 
                            type="time"
                            name="start_time"
                            defaultValue={get24hrTimestamp(record.startTime)}
                        />
                        <LabelledInput
                            question="End Time" 
                            type="time"
                            name="end_time"
                            defaultValue={get24hrTimestamp(record.endTime)}
                        />
                    </div>
                    <LabelledInput
                        question="Note/description of work"
                        type="text"
                        name="note"
                        placeholder="Description of volunteering work (optional)"
                        defaultValue={record.note}
                    />
                    {(totalHours && date) ? <p>Awarding {totalHours} hours to {volunteer.fullName} on {date}.<br/></p> : <></>}
                    <input type="submit" value="Update"/>
                </form>
            </Popup>
        </>
    )
}
"use client";
import { useState } from "react";
import { VolunteerAttendanceCheckInProps } from "./VolunteerAttendanceStatus";
import { LabelledInput, MultipleChoice, Popup } from "@mymast/ui";
import { calculateTimeDifference, convert24hrTimestamp } from "@mymast/utils/convert_timestamp";
import { formDateToDateObject, longDateString } from "@mymast/utils/string_helpers";
import API from "@/app/lib/APIHandler";
import { useRouter } from "next/navigation";
import { FetchError } from "@mymast/api/Types";

export default function AddVolunteerHours({program, volunteer, auth}: VolunteerAttendanceCheckInProps) {
    const [popupActive, setPopupActive] = useState(false);
    const [totalHours, setTotalHours] = useState(0);
    const [date, setDate] = useState("");
    const router = useRouter();

    async function processFormData(data: FormData, submit?: boolean) {
        let date = data.get("date")?.toString();
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

        if (date) {
            setDate( longDateString(formDateToDateObject(date)) );
        } else if (submit) {
            alert("Please enter a date!");
            return;
        };

        if (submit) {
            console.log("submitting");
            try {
                await API.Admin.attendance.addVolunteerHours(
                    auth.uuid,
                    auth.token,
                    program.id,
                    volunteer.uuid,
                    formDateToDateObject(date!),
                    convert24hrTimestamp(times.start!),
                    convert24hrTimestamp(times.end!),
                    data.get("note")?.toString()
                )
                console.log("done")
                router.refresh();
                if (data.get("prevent_closing")?.toString() != "true") {
                    setPopupActive(false);
                } else {
                    alert("Added hours!")
                }
            } catch (res) {
                if ((res as FetchError).code == 409) {
                    alert("This volunteer has already been rewarded hours for some time during the selected date and time range. No new hours will be rewarded.")
                }
            }
        }
    }

    return (
        <>
            <button onClick={() => {setPopupActive(true)}}>Add hours</button>
            <Popup active={popupActive} onClose={() => {
                router.refresh();
                setPopupActive(false);
            }}>
                <h2>Add volunteering hours for {volunteer.fullName}</h2>
                <p>
                    <b>Adding hours for:</b> {program.name}
                    <br/>
                    Hours can only be added for a single-day at a time. The start-time and end-time must be on the same day. 
                </p>
                
                <form 
                    onChange={(e) => {
                        let data = new FormData(e.currentTarget);
                        processFormData(data);
                    }} 
                    action={(data) => {
                        processFormData(data, true);
                    }}
                >
                    <div className="tri-fold">
                        <LabelledInput
                            question="Date"
                            type="date"
                            required
                            name="date"
                        />
                        <LabelledInput
                            question="Start Time" 
                            type="time"
                            required
                            name="start_time"
                        />
                        <LabelledInput
                            question="End Time" 
                            type="time"
                            required
                            name="end_time"
                        />
                    </div>
                    <LabelledInput
                        question="Note/description of work"
                        type="text"
                        name="note"
                        placeholder="Description of volunteering work (optional)"
                    />
                    {(totalHours && date) ? <p>Awarding {totalHours} hours to {volunteer.fullName} on {date}.<br/></p> : <></>}
                    <input type="submit" value="Add hours"/>
                    <MultipleChoice
                        question="Adding hours for multiple days?"
                        type="checkbox"
                        values={[
                            ["true", "Check this box to prevent the popup from closing"]
                        ]}
                        name="prevent_closing"
                    />
                </form>
            </Popup>
        </>
    )
}
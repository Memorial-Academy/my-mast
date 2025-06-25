"use client";
import API from "@/app/lib/APIHandler";
import { AbridgedVolunteerAttendanceRecord, Session } from "@mymast/api/Types";
import { Popup, Table } from "@mymast/ui";
import getTimestamp from "@mymast/utils/convert_timestamp";
import { longDateString, shortDateString } from "@mymast/utils/string_helpers";
import { useState, useEffect } from "react";

type ViewVolunteeringHoursPopupProps = {
    program: {
        name: string,
        id: string
    }
    auth: Session,
    totalHours: number
}

export default function ViewVolunteeringHoursPopup({program, totalHours, auth}: ViewVolunteeringHoursPopupProps) {
    const [popupActive, setPopupActive] = useState(false);
    const [records, setRecords] = useState<Array<AbridgedVolunteerAttendanceRecord>>([]);

    useEffect(() => {
        API.User.getVolunteeringHours(
            auth.uuid,
            auth.token,
            program.id
        ).then(data => {
            setRecords(data);
        })
    }, [program])

    return (
        <>
            <p>
                <ins>Current hours earned: {totalHours}</ins>
                <br/>
                {totalHours > 0 && <a href="#" role="button" onClick={(e) => {
                    e.preventDefault();
                    setPopupActive(true);
                }}>View summary of hours</a>}
            </p>
            {totalHours > 0 && <Popup active={popupActive} onClose={() => {setPopupActive(false)}} >
                <h2>View Volunteering Hours for {program.name}</h2>
                <p><b>Total hours:</b> {totalHours}</p>
                {records ? 
                    <Table.Root columns={[
                        "Date",
                        "Start Time",
                        "End Time",
                        "Hours",
                        "Note"
                    ]}>
                        {records.map(record => {
                            return <Table.Row key={shortDateString(record.date)} data={[
                                `${longDateString(record.date)} (${shortDateString(record.date)})`,
                                getTimestamp(record.startTime),
                                getTimestamp(record.endTime),
                                record.hours + " hrs",
                                record.note
                            ]} />
                        })}
                    </Table.Root>
                : <p>Loading volunteering hours...</p>
                }
            </Popup>}
        </>
    )
}
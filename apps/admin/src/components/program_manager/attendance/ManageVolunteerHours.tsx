"use client";
import { useEffect, useState } from "react";
import { VolunteerAttendanceCheckInProps } from "./VolunteerAttendanceStatus";
import { ConfirmationPopup, Popup, Table } from "@mymast/ui";
import { AbridgedVolunteerAttendanceRecord } from "@mymast/api/Types";
import { longDateString, shortDateString } from "@mymast/utils/string_helpers";
import getTimestamp, { calculateTimeDifference } from "@mymast/utils/convert_timestamp";
import API from "@/app/lib/APIHandler";
import { useRouter } from "next/navigation";
import AddVolunteerHours from "./AddVolunteerHours";

export default function ManageVolunteerHours({program, auth, volunteer}: VolunteerAttendanceCheckInProps) {
    const [popupActive, setPopupActive] = useState(false);
    const [records, setRecords] = useState<AbridgedVolunteerAttendanceRecord[]>();
    const [loaded, setLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        API.Admin.attendance.getVolunteerHours(
            auth.uuid,
            auth.token,
            program.id,
            volunteer.uuid
        ).then((res) => {
            setRecords(res)
            setLoaded(true)
        })
    }, [program])

    return (
        <>
            <button onClick={() => {setPopupActive(true)}}>Manage hours</button>
            <Popup active={popupActive} onClose={() => {setPopupActive(false)}}>
                <h2>Manage volunteering hours for {volunteer.fullName}</h2>
                {loaded ? 
                    <Table.Root columns={[
                        "Date",
                        "Start Time",
                        "End Time",
                        "Hours",
                        "Note",
                        ""
                    ]}>
                        {records ? records.map((record, index) => {
                            return <Table.Row key={volunteer.fullName + index} data={[
                                longDateString(record.date),
                                getTimestamp(record.startTime),
                                record.endTime != -1 ? getTimestamp(record.endTime) : "Incomplete",
                                record.endTime != -1 ? calculateTimeDifference(record.startTime, record.endTime) : "TBD",
                                record.note,
                                <>
                                    <ConfirmationPopup 
                                        buttonText="Delete"
                                        buttonStyle="link"
                                        message={`You are about to delete a volunteering record for ${volunteer.fullName} for the program ${program.name}. This record is on ${shortDateString(record.date)}, from ${getTimestamp(record.startTime)} to ${getTimestamp(record.endTime)}, awarding ${record.hours} hrs.${record.note ? ` It has the note of "${record.note}".` : ""} Are you sure you want to continue?`}
                                        callback={async () => {
                                            API.Admin.attendance.deleteVolunteeringSession(
                                                auth.uuid,
                                                auth.token,
                                                program.id,
                                                volunteer.uuid,
                                                {
                                                    date: record.date,
                                                    startTime: record.startTime,
                                                    endTime: record.endTime,
                                                }
                                            ).then(() => {
                                                router.refresh();
                                            })
                                        }}
                                    />
                                </>
                            ]} />
                        }) : <p>No records found for {volunteer.fullName} for the program {program.name}. Try adding some volunteering hours!</p>}
                    </Table.Root>
                : <p>Loading volunteering records...</p>}
                {/* AddVolunteerHours is in two place for ease of access */}
                <AddVolunteerHours 
                        program={program}
                        volunteer={volunteer}
                        auth={auth}
                />
            </Popup>
        </>
    )
}
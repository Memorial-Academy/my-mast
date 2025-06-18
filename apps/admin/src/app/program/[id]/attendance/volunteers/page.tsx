import { VolunteerCheckInStatus } from "@/components/program_manager/attendance/VolunteerAttendanceStatus";
import generateProgramManagerMetadata, { ParamsArgument } from "../../generate_metadata";
import API from "@/app/lib/APIHandler";
import { Table } from "@mymast/ui";
import sessionInfo from "@mymast/utils/authorize_session";
import { getFullName } from "@mymast/utils/string_helpers";
import Link from "next/link";
import { Suspense } from "react";

export const generateMetadata = generateProgramManagerMetadata("Volunteer Attendance/Hours");

export default async function Page({params}: ParamsArgument) {
    const data = await API.Application.getProgram((await params).id);
    const auth = (await sessionInfo())!;
    const volunteers = await API.Admin.getEnrolledVolunteers(
        auth.uuid,
        auth.token,
        data.id
    )

    return (
        <>
            <h2>Volunteer Attendance & Hours for "{data.name}"</h2>
            <p>This page only lists hours and attendance records for volunteers enrolled in this program. To view and manage volunteers by week and course, please see the <Link href="../enrollment/volunteers">Volunteer Enrollments page</Link>.</p>
            <Table.Root columns={[
                "Name",
                "Weeks Attending",
                "Check in/out",
                "Manage hours",
                "Total hours"
            ]}>
                {volunteers.confirmedAssignments.map(({volunteer, signup}) => {
                    return <Table.Row key={getFullName(volunteer.name)} data={[
                        getFullName(volunteer.name),
                        signup.commitments.map(commitment => {
                            return commitment.week;
                        }).join(", "),
                        <Suspense fallback={
                            <p>Loading...</p>
                        }>
                            <VolunteerCheckInStatus
                                program={{
                                    id: data.id,
                                    name: data.name
                                }}
                                volunteer={{
                                    uuid: volunteer.uuid,
                                    fullName: getFullName(volunteer.name)
                                }}
                                auth={auth}
                            />
                        </Suspense>,
                        <></>,
                        signup.hours + " hrs"
                    ]}/>
                })}
            </Table.Root>
        </>
    )
}
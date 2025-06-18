import API from "@/app/lib/APIHandler"
import { Session } from "@mymast/api/Types"
import VolunteerCheckIn from "./VolunteerCheckIn"
import getTimestamp from "@mymast/utils/convert_timestamp"
import VolunteerCheckOut from "./VolunteerCheckOut"
import VolunteerCheckInConflict from "./VolunteerCheckInConflict"

export type VolunteerAttendanceCheckInProps = {
    program: {
        id: string,
        name: string
    },
    volunteer: {
        uuid: string,
        fullName: string
    },
    auth: Session
}

export async function VolunteerCheckInStatus({program, volunteer, auth}: VolunteerAttendanceCheckInProps) {
    const attendanceStatus = await API.Admin.attendance.checkVolunteerStatus(
        auth.uuid,
        auth.token,
        program.id,
        volunteer.uuid
    );

    if (attendanceStatus.action == "checkin") {
        return <VolunteerCheckIn program={program} volunteer={volunteer} auth={auth} />
    } else if (attendanceStatus.action == "checkout") {
        return <>
            <VolunteerCheckOut program={program} volunteer={volunteer} auth={auth} checkInTime={attendanceStatus.checkInTime} />
            <p>Checked-in at {getTimestamp(attendanceStatus.checkInTime)}</p>
        </>
    } else {
        return <VolunteerCheckInConflict 
            volunteerName={volunteer.fullName}
            conflictProgramName={attendanceStatus.conflictDetails.programName}
            contact={{
                email: attendanceStatus.conflictDetails.email,
                phone: attendanceStatus.conflictDetails.phone
            }}
        />
    }
}
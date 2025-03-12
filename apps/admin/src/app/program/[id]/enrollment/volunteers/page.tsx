import authorizeSession from "@mymast/utils/authorize_session";
import API from "@/app/lib/APIHandler";
import PendingVolunteerAssignments from "@/components/program_manager/PendingVolunteerAssignments";
import ConfirmedVolunteerAssignments from "@/components/program_manager/ConfirmedVolunteers";

type Params = Promise<{
    id: string
}>

export async function generateMetadata({params}: {params: Params}) {
    const data = await API.Application.getProgram((await params).id);

    return {
        title: `Volunteers - ${data.name} - Program Manager | Admin Control Panel | Memorial Academy of Science and Technology`
    }
}

export default async function Page({params}: {params: Params}) {
    const data = await API.Application.getProgram((await params).id);

    const auth = (await authorizeSession())!;

    const enrollmentData = await API.Admin.getEnrolledVolunteers(auth.uuid, auth.token, data.id);

    return (
        <>
            <h2>Volunteer signups for {data.name}</h2>
            <p>Total signups: {enrollmentData.total.pending + enrollmentData.total.confirmed}</p>
            <p>
                <b>Go to...</b>
                <br/>
                <a href="#pending">Pending Assignments</a>
                <br/>
                <a href="#confirmed">Confirmed Assignments</a>
            </p>

            {/* PENDING ASSIGNMENTS */}
            <h2 id="pending">Pending Assignments</h2>
            <p><b>Total pending signups:</b> {enrollmentData.total.pending}</p>
            <PendingVolunteerAssignments
                program={data}
                assignments={enrollmentData.pendingAssignments}
            />

            {/* CONFIRMED ASSIGNMENTS */}
            <h2 id="confirmed">Confirmed</h2>
            <p><b>Total confirmed signups:</b> {enrollmentData.total.confirmed}</p>
            <ConfirmedVolunteerAssignments
                program={data}
                assignments={enrollmentData.confirmedAssignments}
            />
        </>
    )
}
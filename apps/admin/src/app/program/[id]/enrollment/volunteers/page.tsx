import authorizeSession from "@mymast/utils/authorize_session";
import API from "@/app/lib/APIHandler";
import PendingVolunteerAssignments from "@/components/program_manager/PendingVolunteerAssignments";

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
            <p>Total signups: {enrollmentData.total.pending}</p>
            <p>
                <b>Go to...</b>
                <br/>
                <a href="#pending">Pending Assignments</a>
                <br/>
                <a href="#confirmed">Confirmed Assignments</a>
            </p>

            {/* PENDING ASSIGNMENTS */}
            <PendingVolunteerAssignments
                program={data}
                assignments={enrollmentData.pendingAssignments}
                total={enrollmentData.total.pending}
            />

            {/* CONFIRMED ASSIGNMENTS */}
            <h2 id="confirmed">Confirmed</h2>
        </>
    )
}
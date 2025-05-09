import API from "@/app/lib/APIHandler";
import PendingVolunteerAssignmentsSection from "./PendingVolunteerAssingments";
import ConfirmedVolunteerAssignmentsSection from "./ConfirmedVolunteerAssignments";
import Link from "next/link";

type VolunteerDashboardProps = {
    uuid: string
    token: string
}

export default async function VolunteerDashboard(props: VolunteerDashboardProps) {
    const signups = await API.User.getVolunteerAssignments(props.uuid, props.token);

    return (
        <>
            <p>
                Your MyMAST dashboard allows you to see everything related to your volunteering commitments at MAST. Missed an email? Checking your volunteering hours? All the information you need is right here!
                {/* <br/> */}
                {/* If you're assigned instructor duties, this dashboard will allow you to access controls for your program, such as attendance rosters, curriculums, and parent contact information. */}
            </p>
            <h2>My Signups</h2>

            <p>
                Looking for more programs to volunteer for?&nbsp;
                <Link href="/programs">Check out all the programs currently looking for volunteers!</Link>
            </p>
            
            {/* Pending assignments */}
            <PendingVolunteerAssignmentsSection signups={signups.pending} />

            {/* Confirmed assignments */}
            <ConfirmedVolunteerAssignmentsSection signups={signups.assignments} />
        </>
    )
}
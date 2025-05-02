import { Program } from "@mymast/api/Types";
import { Card } from "@mymast/ui";
import sessionInfo from "@mymast/utils/authorize_session";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Programs | MyMAST",
    description: "Browse programs to enroll and volunteer in from the Memorial Academy of Science and Technology"
};

export default async function Page() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/programs`);
    const programs: Array<Program> = await res.json();

    const authCookie = await sessionInfo();
    let userRole: string;

    if (authCookie) {
        let roleReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/role`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uuid: authCookie.uuid,
                token: authCookie.token
            })
        })

        if (roleReq.ok) {
            userRole = await roleReq.text();
        }
    }

    return (
        <>
            <h2>Programs</h2>
            {programs.length > 0 ? programs.map(program => {
                return <Card header={program.name} key={program.id}>
                    <div className="tri-fold">
                        <img src={`/img/${program.program_type}_vertical_dark.png`} alt={`${program.name} logo`} />
                        <p>
                            <b>Location: {program.location.common_name || "Virtual"}</b>
                            <br/>
                            {program.location.loc_type == "physical" && <span>
                                {program.location.address}
                                <br/>
                                {program.location.city}, {program.location.state} {program.location.zip}
                            </span>}
                        </p>
                        <p>
                            {program.schedule.map((week, index) => {
                                return <span key={"week" + index}>
                                    <b>Week {index + 1}:</b>&nbsp;
                                    {week[0].month}/{week[0].date}/{week[0].year} - {week.at(-1)!.month}/{week.at(-1)!.date}/{week.at(-1)!.year}
                                    <br/>
                                </span>
                            })}

                        </p>
                    </div>
                    <div className="flex-row-resize">
                        {(!userRole || userRole == "parent") && <>
                            <Link
                                className="big-button"
                                href={`/programs/enroll/${program.id}`}
                            >
                                Enroll!
                            </Link>
                        </>}
                        {(!userRole || userRole == "volunteer") && <>
                            <Link
                                className="big-button"
                                href={`/programs/volunteer/${program.id}`}
                            >
                                Volunteer!
                            </Link>
                        </>}
                    </div>
                </Card>
            }) : <p>There are no programs available to signup for currently. Check back later for the latest opportunities!</p>}
        </>
    );
}

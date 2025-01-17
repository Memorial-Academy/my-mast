import { Metadata } from "next";
import authorizeSession from "@mymast/utils/authorize_session";
import getTimestamp from "@mymast/utils/convert_timestamp";

type Params = Promise<{
    signup: string,
    id: string
}>

export async function generateMetadata({params}: {params: Params}) {
    const id = (await params).id;

    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/program/${id}`)
    const data: ProgramData = await req.json();

    return {
        title: `${data.name} - Program Manager | Admin Control Panel | Memorial Academy of Science and Technology`
    }
}

export default async function Page({params}: {params: Params}) {
    const id = (await params).id;
    const auth = (await authorizeSession())!;

    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/program/${id}`)
    const data: ProgramData = await req.json();

    return (
        <>
            <h2>Information for "{data.name}"</h2>

            <h3 id="schedule">Schedule</h3>
            <section className="tri-fold">
                {data.schedule.map((week, index) => {
                    return (
                        <div key={"week" + index} >
                            <h4>Week {index + 1}</h4>
                            <p>
                                {week.map(day => {
                                    return <>
                                        <b>Day {day.dayCount}:</b>&nbsp;
                                        {day.month}/{day.date}/{day.year}: {getTimestamp(day.start)} - {getTimestamp(day.end)}
                                        <br/>
                                    </>
                                })}
                            </p>
                        </div>
                    )
                })}
            </section>

            <h3 id="location">Location</h3>
            <div className="bi-fold">
                <p><b>Location type:</b> {data.location.loc_type == "physical" ? "In-person" : "Virtual"}</p>
                {data.location.loc_type == "physical" && <>
                    <p>
                        <b>Address for "{data.location.common_name}":</b>
                        <br/>
                        {data.location.address}
                        <br/>
                        {data.location.city}, {data.location.state} {data.location.zip}
                    </p>
                </>}
            </div>

            <h3>Courses</h3>
            {data.courses.length == 1 && <p>
                <b>This program only offers one course.</b>&nbsp;
                When enrolling, this course will automatically be selected. Course information is listed below to allow an overview of the offered enrollment option.
            </p>}
            {data.courses.map(course => {
                return (
                    <>
                        <h4>"{course.name}"</h4>
                        <p>
                            <b>Course duration:</b>&nbsp;
                            {course.duration} week{course.duration > 1 ? "s" : ""}
                        </p>
                        <p>
                            <b>Enrollment availability:</b>
                            &nbsp;week{course.available.length > 1 ? "s" : ""}
                            &nbsp;
                            {course.available.length > 1 ? course.available.map((week, index) => {
                                if (course.available.length - 1 == index) {
                                    return `and ${week}`;
                                } else if (course.available.length - 2 == index) {
                                    return `${week} `;
                                } else {
                                    return `${week}, `;
                                }
                            }) : course.available[0]}
                        </p>
                    </>
                )
            })}

            <h3>Administrative People</h3>
            <h4>Primary Contact ("Program Director")</h4>
            <p>
                <b>{data.contact.name.first} {data.contact.name.last}</b>
                <br/>
                Email: {data.contact.email}
                <br/>
                Phone: {data.contact.phone}
            </p>
            <h4>Directors</h4>
            {data.admins.map(async director => {
                let req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/getuser`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        uuid: auth.uuid,
                        token: auth.token,
                        requested_uuid: director
                    })
                });

                if (!req.ok) {
                    return <></>;
                }

                let user = await req.json();
                let profile = user.profile;
                console.log(profile)

                return <p key={director}>
                    <b>{profile.name.first} {profile.name.last}</b>
                    <br/>
                    Email: {profile.email}
                    <br/>
                    Phone: {profile.phone}
                    <br/>
                    School: {profile.school}
                </p>
            })}
        </>
    )
}
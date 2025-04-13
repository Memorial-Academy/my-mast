import authorizeSession from "@mymast/utils/authorize_session";
import getTimestamp from "@mymast/utils/convert_timestamp";
import API from "@/app/lib/APIHandler";
import { UserTypes } from "@mymast/api/Types";
import { Card } from "@mymast/ui";
import AddDirectorPopup from "@/components/program_manager/AddDirectorPopup";

type Params = Promise<{
    id: string
}>

export async function generateMetadata({params}: {params: Params}) {
    const data = await API.Application.getProgram((await params).id);
    
    return {
        title: `${data.name} - Program Manager | Admin Control Panel | Memorial Academy of Science and Technology`
    }
}

export default async function Page({params}: {params: Params}) {
    const data = await API.Application.getProgram((await params).id);

    const auth = (await authorizeSession())!;    

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
            <div className="tri-fold">
                {data.courses.map(course => {
                    return (
                        <Card
                            key={course.name}
                            header={`${course.name}`}
                        >
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
                        </Card>
                    )
                })}
            </div>

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
            <div className="tri-fold">
                {data.admins.map(async director => {
                    let user = await API.Admin.getUser<UserTypes.Volunteer>(auth.uuid, auth.token, director);
                    let profile = user.profile;

                    return (
                        <Card
                            header={`${profile.name.first} ${profile.name.last}`}
                            key={director}
                        >
                            <p>
                                <b>Email:</b> {profile.email}
                                <br/>
                                <b>Phone:</b> {profile.phone}
                                <br/>
                                <b>School:</b> {profile.school}
                            </p>
                        </Card>
                    )
                })}
            </div>
            <AddDirectorPopup
                programName={data.name}
                programID={data.id}
            />
        </>
    )
}
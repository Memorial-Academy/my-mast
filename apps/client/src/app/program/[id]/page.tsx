import { Metadata } from "next";

type GenerateMetadataProps = {
    params: Promise<{id: string}>,
    searchParams: Promise<{ [key: string]: undefined }>
}

export async function generateMetadata({params, searchParams}: GenerateMetadataProps): Promise<Metadata> {
    const [id, signupType] = (await params).id.split("-");
    const data = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/program/${id}`)).json();

    return {
        title: `${signupType == "volunteer" ? "Volunteer for " : "Enroll in "} ${data.name} | Memorial Academy of Science and Technology`,
        description: `${signupType == "volunteer" ? "Volunteer for " : "Enroll in "} ${data.name} at the Memorial Academy of Science and Technology`
    }
}

export default async function Page({params}: {params: {id: Promise<string>}}) {
    let [programID, signupType] = (await params.id).split("-");
    const data: ProgramData = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/app/program/${programID}`)).json();
    let icon = "";
    let email = "";

    if (data.name.toLowerCase().indexOf("let's code") > -1) {
        icon = "/img/letscode_vertical_dark.png";
        email = "letscode@memorialacademy.org";
    } else if (data.name.toLowerCase().indexOf("stempark") > -1) {
        icon = "/img/stempark_vertical_dark.png";
        email = "stempark@memorialacademy.org";
    }
    
    if (!signupType) {
        signupType == "enroll";
    }

    let schedule = [];
    for (var weekCount = 1; weekCount <= data.schedule.length; weekCount++) {
        let week = data.schedule[weekCount - 1]
        schedule.push(<p>
            {data.schedule.length > 1 ? <><b>Week {weekCount}</b><br/></> : <></>}
            {week.map(day => {
                return <>{day.month}/{day.date}/{day.year}: {getTimestamp(day.start)} - {getTimestamp(day.end)}<br/></>
            })}
        </p>)
    }

    return (
        <>
            <div className="split">
                <img src={icon} alt={`${data.name} logo`} />
                <div>
                    <h2>{data.name}</h2>
                    
                    <h3>Location</h3>
                    <p>
                        {data.location.loc_type == "virtual" ? 
                        <>
                            <b>Virtual</b>
                            <br/>
                            Links will be sent to enrolled members via email and published on their MyMAST dashboard a few days before the program begins.
                        </> : <>
                            <b>{data.location.common_name}</b>
                            <br/>
                            {data.location.address}
                            <br/>
                            {data.location.city}, {data.location.state} {data.location.zip}
                        </>}
                    </p>

                    <h3>Schedule</h3>
                    {schedule}

                    <h3>Contact Information</h3>
                    <p>
                        The program director manages operations of this specific program. Sometimes they are MAST team members, other times they are experienced volunteers recruited by MAST.
                        <br/>
                        In addition to the program director, remember enrollment and program-specific questions may always be emailed to <a href={`mailto:${email}?subject=${data.name} -- <put your question here!>`}>{email}</a>.
                    </p>
                    <p>Program Director: {data.contact.name.first} {data.contact.name.last}</p>
                    <p>Email: <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a></p>
                    <p>Phone: {data.contact.phone}</p>
                </div>
            </div>
        </>
    )
}

function getTimestamp(time: number) {
    let str = time.toPrecision(4).split(".");
    let period: string;

    if (time >= 12) {
        period = "P.M";
        str[0] = (parseInt(str[0]) - 12).toString();
    } else {
        period = "A.M";
    }
    
    return `${str[0]}:${str[1]} ${period}`;
}
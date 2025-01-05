import React from "react";
import getTimestamp from "@mymast/utils/convert_timestamp";
import EnrollButton from "./EnrollButton";

type ProgramInfoProps = {
    data: ProgramData,
    signupType: string,
    user: {
        uuid: string
        sessionToken: string
    },
    students?: Array<{
        name: {
            first: string,
            last: string,
        },
        uuid: string
    }>
}

export default function ProgramInfo(props: ProgramInfoProps) {
    const data = props.data;

    let schedule = [];
    for (var weekCount = 1; weekCount <= data.schedule.length; weekCount++) {
        let week = data.schedule[weekCount - 1]
        schedule.push(<p key={"week_" + weekCount} >
            {data.schedule.length > 1 ? <><b>Week {weekCount}</b><br/></> : <></>}
            {week.map(day => {
                return <span key={weekCount + "_" + day.dayCount}>{day.month}/{day.date}/{day.year}: {getTimestamp(day.start)} - {getTimestamp(day.end)}<br/></span>
            })}
        </p>)
    }

    return (
        <div className="split">
            <div>
                <img src={`/img/${data.program_type}_vertical_dark.png`} alt={`${data.name} logo`} />
                
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
            </div>
            <div>
                <h2>{data.name}</h2>

                <h3>Schedule</h3>
                {schedule}

                {data.courses.length > 1 ? <>
                    <h3>Classes Offered</h3>
                    <ul>
                        {data.courses.map(course => {
                            return <li key={course.name}>
                                {course.name}
                                {course.duration > 1 ? ` (${course.duration} weeks long)` : ""}
                            </li>
                        })}
                    </ul>
                </> : <></>}


                <h3>Contact Information</h3>
                <p>
                    The program director manages operations of this specific program. Sometimes they are MAST team members, other times they are experienced volunteers recruited by MAST.
                    <br/>
                    In addition to the program director, remember enrollment and program-specific questions may always be emailed to <a href={`mailto:${data.program_type}@memorialacademy.org?subject=${data.name} -- <put your question here!>`}>{data.program_type}@memorialacademy.org</a>.
                </p>
                <p>Program Director: {data.contact.name.first} {data.contact.name.last}</p>
                <p>Email: <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a></p>
                <p>Phone: {data.contact.phone}</p>
                
                <br/>
                {/* <p>
                    <a 
                        href={`https://memorialacademy.org/${props.signupType == "volunteer" ? "volunteer/" : ""}${data.program_type}`} 
                        target="_blank"
                    >
                        Learn more
                    </a> about the {data.program_type == "letscode" ? "Let's Code" : "STEMpark"} program on the MAST website!
                </p> */}
                <EnrollButton 
                    signupType={props.signupType as ("volunteer" | "enroll")} 
                    uuid={props.user.uuid}
                    sessionToken={props.user.sessionToken} 
                    program={data}
                    students={props.students}
                />
            </div>
        </div>
    )
}
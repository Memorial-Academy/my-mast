"use client";
import { useState } from "react";
import Popup from "../Popup";
import convertTimestamp from "@mymast/utils/convert_timestamp";

type EnrollmentCardScheduleProps = {
    course: Course,
    program: ProgramData,
    week: number
}

type ScheduleArray = {
    date: {
        month: number,
        day: number,
        year: number
    },
    time: {
        start: string,
        end: string
    }
}

export default function EnrollmentCardSchedule(props: EnrollmentCardScheduleProps) {
    const [popupActive, setPopupActive] = useState(false);

    let schedule: Array<{
        week: number
        schedule: Array<ScheduleArray>
     }> = []

    for (let week = props.week - 1; week + 1 < props.week + props.course.duration; week++) {
        let weeklySchedule: Array<ScheduleArray> = [];
        for (let day of props.program.schedule[week]) {
            weeklySchedule.push({
                date: {
                    month: day.month,
                    day: day.date,
                    year: day.year
                },
                time: {
                    start: convertTimestamp(day.start),
                    end: convertTimestamp(day.end)
                }
            }) 
        }
        schedule.push({
            week: week + 1,
            schedule: weeklySchedule
        })
    }

    return (
        <>
            <p>
                <b>Schedule:</b>&nbsp;
                {schedule[0].schedule[0].date.month}/{schedule[0].schedule[0].date.day}/{schedule[0].schedule[0].date.year} - 
                {schedule.at(-1)!.schedule.at(-1)!.date.month}/{schedule.at(-1)!.schedule.at(-1)!.date.day}/{schedule.at(-1)!.schedule.at(-1)!.date.year}
                <br/>
                <a href="#" onClick={e => {
                    e.preventDefault();
                    setPopupActive(true);
                }}>Click for a detailed scheduled</a>
            </p>
            <Popup
                active={popupActive}
                onClose={() => {
                    setPopupActive(false);
                }}
            >
                <h3>Day-by-day schedule for {props.program.courses.length > 1 ? props.course.name : props.program.name}</h3>
                <p>
                    {props.program.name}
                    {props.program.location.loc_type == "physical" ? ` @ ${props.program.location.common_name}` : "; hosted virtually"}
                </p>
                {schedule.map(week => {
                    return (
                        <p key={`week-${week.week}`}>
                            <b>Week {week.week}</b>
                            {week.schedule.map(day => {
                                return (
                                    <span key={`${week.week}-${day.date.month}/${day.date.day}/${day.date.year}`}>
                                        <br/>
                                        {day.date.month}/{day.date.day}/{day.date.year}: {day.time.start} - {day.time.end}
                                    </span>
                                )
                            })}
                        </p>
                    )
                })}
            </Popup>
        </>
    )
}
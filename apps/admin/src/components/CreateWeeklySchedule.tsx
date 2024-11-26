"use client";
import { LabelledDropdown, LabelledInput } from "@mymast/ui";
import { useState, ChangeEvent } from "react";

// Wrapper for all of it
export default function CreateWeeklySchedule({}) {
    const [weeks, setWeeks] = useState(1);
    let elems = [];

    for (var i = 0; i < weeks; i++) {
        elems.push(
            <WeeklySchedule weekNumber={i + 1} key={`week_${i+1}`} />
        )
    }

    return (
        <>
            <p>Total weeks: {weeks}</p>
            {elems}
            <p>
                <a href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        setWeeks(weeks + 1)
                    }
                }>+ Add week</a>
                &nbsp;&nbsp;
                {weeks > 1 ? <a href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        setWeeks(weeks - 1)
                    }
                }>- Remove week</a> : <></>}
            </p>
        </>
    )
}

// General types
type Date = {
    month: number,
    day: number,
    year: number
}

type WeeklySchedule = {
    dayNumber: number,
    date: Date,
    startTime: number,
    endTime: number
}

export function WeeklySchedule({weekNumber}: {weekNumber: number}) {
    const [days, setDays] = useState(1);
    let elems = [];

    for (var i = 0; i < days; i++) {
        elems.push(
            <DailySchedule weekNumber={weekNumber} dayNumber={i + 1} key={`week${weekNumber}_day${i + 1}`}/>
        )
    }

    return (
        <>
            <p><b>Week {weekNumber}</b></p>
            {elems}
            <p>
                {days < 7 ? <a href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        setDays(days + 1)
                    }
                }>+ Add day</a> : <></>}
                &nbsp;&nbsp;
                {days > 1 ? <a href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        setDays(days - 1)
                    }
                }>- Remove day</a> : <></>}
            </p>
        </>
    )
}

//Types for the daily schedule elements
type DailyScheduleProps = {
    weekNumber: number,
    dayNumber: number
}

function DailySchedule(props: DailyScheduleProps) {
    const [start, setStart] = useState(7); // lowest possible value in TimeDropdown is 7
    const [end, setEnd] = useState(0);
    
    function validateTimes(start: number, end: number) {
        if (end != 0 && start >= end) {
            alert("Ensure the start time is before the end time");
        }
    }
    return (
        <div className="tri-fold">
            <LabelledInput
                question={`Day ${props.dayNumber}`}
                type="date"
                name={`week${props.weekNumber}_day${props.dayNumber}_date`}
                placeholder="Start"
                required
            />
            <LabelledDropdown
                question="Start Time"
                required
                values={TimeDropdownValues}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    let num = parseFloat(e.target.value);
                    setStart(num);
                    validateTimes(num, end);
                }}
                name={`week${props.weekNumber}_day${props.dayNumber}_start`}
            />
            <LabelledDropdown
                question="End Time"
                required
                values={TimeDropdownValues}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    let num = parseFloat(e.target.value);
                    setEnd(num);
                    validateTimes(start, num);
                }}
                name={`week${props.weekNumber}_day${props.dayNumber}_end`}
            />
        </div>
    )
}

const TimeDropdownValues = [
    [7, "7:00 A.M"],
    [7.25, "7:15 A.M"],
    [7.5, "7:30 A.M"],
    [7.75, "7:45 A.M"],
    [8, "8:00 A.M"],
    [8.25, "8:15 A.M"],
    [8.5, "8:30 A.M"],
    [8.75, "8:45 A.M"],
    [9, "9:00 A.M"],
    [9.25, "9:15 A.M"],
    [9.5, "9:30 A.M"],
    [9.75, "9:45 A.M"],
    [10, "10:00 A.M"],
    [10.25, "10:15 A.M"],
    [10.5, "10:30 A.M"],
    [10.75, "10:45 A.M"],
    [11, "11:00 A.M"],
    [11.25, "11:15 A.M"],
    [11.5, "11:30 A.M"],
    [11.75, "11:45 A.M"],
    [12, "12:00 P.M"],
    [12.25, "12:15 P.M"],
    [12.5, "12:30 P.M"],
    [12.75, "12:45 P.M"],
    [13, "1:00 P.M"],
    [13.25, "1:15 P.M"],
    [13.5, "1:30 P.M"],
    [13.75, "1:45 P.M"],
    [14, "2:00 P.M"],
    [14.25, "2:15 P.M"],
    [14.5, "2:30 P.M"],
    [14.75, "2:45 P.M"],
    [15, "3:00 P.M"],
    [15.25, "3:15 P.M"],
    [15.5, "3:30 P.M"],
    [15.75, "3:45 P.M"],
    [16, "4:00 P.M"],
    [16.25, "4:15 P.M"],
    [16.5, "4:30 P.M"],
    [16.75, "4:45 P.M"],
    [17, "5:00 P.M"],
    [17.25, "5:15 P.M"],
    [17.5, "5:30 P.M"],
    [17.75, "5:45 P.M"],
    [18, "6:00 P.M"],
    [18.25, "6:15 P.M"],
    [18.5, "6:30 P.M"],
    [18.75, "6:45 P.M"],
    [19, "7:00 P.M"],
    [19.25, "7:15 P.M"],
    [19.5, "7:30 P.M"],
    [19.75, "7:45 P.M"],
    [20, "8:00 P.M"],
    [20.25, "8:15 P.M"],
    [20.5, "8:30 P.M"],
    [20.75, "8:45 P.M"],
    [21, "9:00 P.M"],
]
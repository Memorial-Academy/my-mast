import React, { ReactNode } from "react";
import { Course, Program } from "@mymast/api/Types";
import { longDateString, shortDateString, startEndTimesString } from "@mymast/utils/time_strings";

type EnrollmentCardScheduleProps = {
    course: Course,
    program: Program,
    week: number
}

export default function EnrollmentCardSchedule(props: EnrollmentCardScheduleProps) {
    let schedules: Array<ReactNode> = [];

    // starting at the first week of enrollment, get the schedule for all weeks of enrollment
    for (let week = props.week - 1; week + 1 < props.week + props.course.duration; week++) {
        let dates: Array<ReactNode> = [];

        // get the schedule for each day of the week
        let weekSchedule = props.program.schedule[week]
        for (let day of weekSchedule) {
            dates.push(
                <>
                    <span>
                        {shortDateString(day)}: {startEndTimesString(day.start, day.end)}
                    </span>
                    <br/>
                </>
            )
        }

        schedules.push(
            <p>
                <b>Week {week + 1} Schedule</b>
                &nbsp;({longDateString(weekSchedule[0])} to {longDateString(weekSchedule.at(-1)!)})
                <br/>
                {dates}
            </p>
        )
    }

    return (
        <>
            {schedules}
        </>
    )

}
import { DailySchedule } from "@mymast/api/Types";
import getTimestamp from "./convert_timestamp";

export function shortDateString(day: DailySchedule) {
    return `${day.month}/${day.date}/${day.year}`;
}

export function longDateString(day: DailySchedule) {
    let month = "";

    switch (day.month) {
        case 1:
            month = "January";
            break;
        case 2:
            month = "February";
            break;
        case 3:
            month = "March";
            break;
        case 4:
            month = "April";
            break;
        case 5:
            month = "May";
            break;
        case 6:
            month = "June";
            break;
        case 7:
            month = "July";
            break;
        case 8:
            month = "August";
            break;
        case 9:
            month = "September";
            break;
        case 10:
            month = "October";
            break;
        case 11:
            month = "November";
            break;
        case 12:
            month = "December";
            break;
    }
        return `${month} ${day.date}, ${day.year}`;
}

export function startEndTimesString(startTime: number, endTime: number) {
    return `${getTimestamp(startTime)} - ${getTimestamp(endTime)}`;
}
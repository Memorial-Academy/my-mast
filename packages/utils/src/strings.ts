import getTimestamp from "./convert_timestamp";
import { FullName } from "@mymast/api/Types";

type GenericDate = {
    date: number,
    year: number,
    month: number,
    [key: string]: any
}

export function shortDateString(day: GenericDate) {
    return `${day.month}/${day.date}/${day.year}`;
}

export function longDateString(day: GenericDate) {
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

export function getFullName(name: FullName) {
    return `${name.first} ${name.last}`;
}

export function leadingZero(num: number) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num.toString();
    }
}
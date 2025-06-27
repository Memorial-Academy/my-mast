import { leadingZero } from "./strings";

// Convert an integer (12.5) to a time string (12:30 P.M)
export default function getTimestamp(time: number) {
    let str = time.toPrecision(4).split(".");   // str[0] is hours, str[1] is minutes (decimal value)
    let period: string;
    
    let hr = parseInt(str[0]);
    if (time >= 12) {
        period = "P.M";
        str[0] = (hr > 12 ? hr - 12 : hr).toString();
    } else {
        period = "A.M";
        str[0] = (hr == 0 ? 12 : hr).toString();
    }

    let min = Math.round(60 * parseFloat("0." + str[1]));
    
    return `${str[0]}:${leadingZero(min)} ${period}`;
}

// convert an interger to a 24 hr timestamp
export function get24hrTimestamp(time: number) {
    let str = time.toPrecision(4).split(".");   // str[0] is hours, str[1] is minutes (decimal value)
    let min = Math.round(60 * parseFloat("0." + str[1]));
    return(`${leadingZero(parseInt(str[0]))}:${leadingZero(min)}`);
}

// Convert 24-hour timestamp (15:30 for 3:30 P.M) to an integer 
export function convert24hrTimestamp(timestamp: string) {
    let arr = timestamp.split(":");
    let hr = parseInt(arr[0]);
    hr += parseInt(arr[1]) / 60;
    return roundTimeInteger(hr);
}

// Convert 12-hour timestamp (3:30 P.M) to an integer 
export function convertTimestamp(timestamp: string) {
    let timeOfDay = timestamp.split(" ")
    let arr = timeOfDay[0].split(":");

    let hr = parseInt(arr[0]);
    if (timeOfDay[1] == "P.M") {
        hr += (hr == 12) ? 0 : 12;    // P.M times that are not 12:xx P.M get 12 added to them
    } else if (timeOfDay[1] == "A.M") {
        hr = (hr == 12) ? 0 : hr     // 12:00 A.M needs to become 0
    } else {
        console.warn(`"${timestamp}" is not a valid 12 hour timestamp, attempting to convert as a 24-hour timestamp`)
        return convert24hrTimestamp(timestamp);
    }

    hr += parseInt(arr[1]) / 60;
    return roundTimeInteger(hr);
}

// HELPER/FORMAT FUNCTIONS
export function roundTimeInteger(int: number) {
    return Math.round(int * 100) / 100;
}

// calculate time (in hours) between two time integers
export function calculateTimeDifference(start: number, end: number) {
    return roundTimeInteger(end - start);
}
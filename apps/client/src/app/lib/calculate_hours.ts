export function calculateHours(start: number, end: number) {
    return end - start;
}

export function calculateHoursFromWeek(weeklySchedule: Array<Schedule>) {
    let total = 0;

    for (let day of weeklySchedule) {
        total += calculateHours(day.start, day.end);
    }

    return total;
}
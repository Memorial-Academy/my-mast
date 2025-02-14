import { FullName } from "./user"

export type Program = {
    id: string,
    name: string,
    program_type: "stempark" | "letscode"

    location: {
        loc_type: "virtual" | "physical"

        // loc_type == "physical"
        common_name?: string,
        address?: string,
        city?: string,
        state?: string,
        zip?: string,

        // loc_type == "virtual"
        link?: string
    },
    schedule: WeeklySchedule[],
    courses: Course[],
    contact: {
        name: FullName,
        phone: string,
        email: string
    },
    volunteering_hours: {
        total: number,
        weekly: number[]
    },
    admins: string[],   // array of admin UUID's
    enrollments: {
        volunteers: string[],   // array of enrollment ID's for volunteers
        students: string[]  // array of enrollment ID's for students
    }
}

export type DailySchedule = {
    dayCount: number,
    date: number,
    month: number,
    year: number,
    start: number,
    end: number
}

export type WeeklySchedule = DailySchedule[];

export type Course = {
    id: number,
    name: string,
    duration: number,
    available: number[]
}
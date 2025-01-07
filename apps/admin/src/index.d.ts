type Schedule = {   // represents one day
    dayCount: number,
    date: number,
    month: number,
    year: number,
    start: number,
    end: number
}

// Program data object returned by API
type ProgramData = {
    id: string,
    name: string,
    program_type: string,   // set server-side for database entry
    location: {
        // `type` on admin, `loc_type` on database and client 
        loc_type: string,   // "virtual" | "physical"

        // type = "physical"
        common_name?: string,
        address?: string,
        city?: string,
        state?: string,
        zip?: string
    },
    schedule: Array<Array<Schedule>>,
    courses: Array<Course>,
    contact: {
        name: {
            first: string,
            last: string
        },
        phone: string,
        email: string
    },
    admins: Array<string>,
    enrollments: {
        volunteers: Array<string>,
        students: Array<string>
    }
}

// Program data object submitted when creating a new program
type ProgramDataSubmitted = {
    name: string,
    location: {
        // `type` on admin, `loc_type` on database and client 
        type: string,   // "virtual" | "physical"

        // type = "physical"
        common_name?: string,
        address?: string,
        city?: string,
        state?: string,
        zip?: string
    },
    schedule: Array<Array<Schedule>>,
    courses: Array<Course>,
    contact: {
        name: {
            first: string,
            last: string
        },
        phone: string,
        email: string
    }
}

type Course = {
    name: string,
    duration: number    // Duration in number of weeks
    available: Array<number>    // Weeks during which a new sessions begin (students are able to enroll)
}
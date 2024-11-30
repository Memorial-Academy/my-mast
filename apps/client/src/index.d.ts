// This types file represents the object as received from the API/database.
// There will be mismatches (as indicated) from the types file in "admin"

type Schedule = {   // represents one day
    dayCount: number,
    date: number,
    month: number,
    year: number,
    start: number,
    end: number
}

type ProgramData = {
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
    }
}

type Course = {
    name: string,
    duration: number    // Duration in number of weeks
    available: Array<number>    // Weeks during which a new sessions begin (students are able to enroll)
}
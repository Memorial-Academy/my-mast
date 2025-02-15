export type FullName = {
    first: string,
    last: string
}

export type Birthday = {
    month: number,
    day: number,
    year: number
}

// for student users
export type ConfirmedEnrollment = {
    program: string,
    course: number,
    week: number,
    id: string
}

// for volunteers
export type PendingVolunteerAssignment = {
    program: string,
    courses: number[],
    weeks: number[],
    instructor: boolean,
    hours: number 
}

export type ConfirmedVolunteerAssignment = {
    program: string,
    commitments: {
        week: number,
        course: number,
        instructor: boolean
    }[],
    id: string
}
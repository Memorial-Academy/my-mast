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
    instructorInterest: boolean,
    hours: number ,
    skills?: string,
    id: string  // Enrollment ID
}

export type ConfirmedVolunteerAssignment = {
    program: string,
    commitments: VolunteeringCommitment[],
    id: string,
    hours: number
}

export type VolunteeringCommitment = {
    week: number,
    course: number,
    instructor: boolean
}
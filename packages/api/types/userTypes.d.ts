import { Birthday, ConfirmedEnrollment, ConfirmedVolunteerAssignment, FullName } from "./user"

export namespace UserTypes {
    type Volunteer = {
        uuid: string,
        name: FullName,
        email: string,
        phone: string,
        birthday: Birthday,
        school: string,
        admin: boolean,
        pendingAssignments: string[],
        skills: string,
        assignments: ConfirmedVolunteerAssignment[]
    }
    
    type Parent = {
        uuid: string,
        name: FullName,
        email: string,
        phone: string,
        linkedStudents: string[]    // Array of student UUID's
    }

    type Student = {
        uuid: string,
        name: FullName,
        birthday: Birthday,
        notes?: string,
        linkedParent: string,
        enrollments: ConfirmedEnrollment[]
    }
}
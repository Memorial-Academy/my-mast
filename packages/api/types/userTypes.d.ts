import { Birthday, ConfirmedEnrollment, ConfirmedVolunteerAssignment, EmergencyContact, FullName } from "./user"

export type UserTypesString = "parent" | "volunteer" | "student";

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
        linkedStudents: string[],   // Array of student UUID's
        emergencyContact: EmergencyContact
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
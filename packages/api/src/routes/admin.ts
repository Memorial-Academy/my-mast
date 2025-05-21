import { ConfirmedVolunteerAssignment, FullName, PendingVolunteerAssignment, VolunteeringCommitment } from "../../types";
import { Program } from "../../types/application";
import { UserTypes } from "../../types/userTypes";
import * as Fetch from "../fetcher";

export default class Admin {
    private url = "https://localhost:5000"
    
    constructor(APIUrl: string) {
        this.url = APIUrl
    }

    // /admin/managedprograms
    async getManagedPrograms(uuid: string, token: string, requested_uuid?: string): Promise<Program[]> {
        return await Fetch.POST.json(this.url, "managedprograms", {
            uuid,
            token,
            requested_uuid
        })
    }

    // /admin/getuser
    async getUser<T extends UserTypes.Volunteer | UserTypes.Student | UserTypes.Parent> (
        admin_uuid: string, 
        token: string, 
        requested_uuid: string
    ): Promise<
        T extends UserTypes.Volunteer ? {
            role: "volunteer",
            profile: UserTypes.Volunteer
        } : T extends UserTypes.Parent ? {
            role: "parent",
            profile: UserTypes.Parent
        } : {}
    > {
        return await Fetch.POST.json(this.url, "getuser", {
            uuid: admin_uuid,
            token,
            requested_uuid
        })
    }

    async getEnrolledStudents(
        uuid: string,
        token: string,
        program_id: string
    ): Promise<{
        courseID: number,
        total: number,
        data: {
            week: number,
            enrollments: {
                student: Omit<UserTypes.Student, "enrollments">,
                parent: Omit<UserTypes.Parent, "linkedStudents">,
                enrollmentID: string
            }[]
        }[]
    }[]> {
        return await Fetch.POST.json(this.url, "enrollments/students", {
            uuid,
            token,
            program: program_id
        })
    }

    async getEnrolledVolunteers(
        uuid: string,
        token: string,
        program_id: string
    ): Promise<{
        total: {
            pending: number,
            confirmed: number
        },
        pendingAssignments: {
            volunteer: Omit<UserTypes.Volunteer, "admin" & "assignments" & "pendingAssignments">
            signup: PendingVolunteerAssignment
        }[],
        confirmedAssignments: {
            volunteer: Omit<UserTypes.Volunteer, "admin" & "assignments" & "pendingAssignments">
            signup: ConfirmedVolunteerAssignment
        }[]
    }> {
        return await Fetch.POST.json(this.url, "enrollments/volunteers", {
            uuid,
            token,
            program: program_id
        })
    }

    async confirmVolunteer(
        uuid: string,
        token: string,
        volunteer_uuid: string,
        program_id: string,
        signupData: VolunteeringCommitment[],
        enrollment_id: string,
        signupNotes?: string
    ) {
        await Fetch.POST.json(this.url, "confirmvolunteer", {
            uuid,
            token,
            volunteer: volunteer_uuid,
            program: program_id,
            data: signupData,
            enrollment: enrollment_id,
            signupNotes
        })
    }

    async getUserByEmail<T extends UserTypes.Volunteer | UserTypes.Student | UserTypes.Parent>(
        uuid: string,
        token: string,
        emailToSearch: string
    ): Promise<
        T extends UserTypes.Volunteer ? {
            role: "volunteer",
            profile: UserTypes.Volunteer
        } : T extends UserTypes.Parent ? {
            role: "parent",
            profile: UserTypes.Parent
        } : {}
    > {
        return await Fetch.POST.json(this.url, "getuserbyemail", {
            uuid,
            token,
            email: emailToSearch
        });
    }

    async addProgramAdmin(
        uuid: string,
        token: string,
        program: string,
        new_admin_uuid: string
    ): Promise<void> {
        return await Fetch.POST.json(this.url, "addadmin", {
            uuid,
            token,
            program,
            new_uuid: new_admin_uuid
        })
    }

    async unenrollStudent(
        uuid: string,
        token: string,
        program: string,
        enrollmentID: string
    ): Promise<void> {
        return await Fetch.POST.json(this.url, "unenroll/student", {
            uuid,
            token,
            program,
            enrollmentID
        })
    }

    async unenrollVolunteer(
        uuid: string,
        token: string,
        program: string,
        enrollmentID: string
    ): Promise<void> {
        return await Fetch.POST.json(this.url, "unenroll/volunteer", {
            uuid,
            token,
            program,
            enrollmentID
        })
    }
}
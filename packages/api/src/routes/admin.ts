import { ConfirmedVolunteerAssignment, FullName, PendingVolunteerAssignment, VolunteeringCommitment } from "../../types";
import { AbridgedVolunteerAttendanceRecord, Program, VolunteerAttendanceRecord } from "../../types/application";
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

    async toggleNewEnrollments(
        uuid: string,
        token: string,
        program: string,
        week: number,
        new_status: boolean
    ): Promise<void> {
        return await Fetch.POST.json(this.url, "allowenrollments", {
            uuid,
            token,
            program,
            week,
            new_status
        })
    }

    attendance = {
        // VOLUNTEER ATTENDANCE
        checkVolunteerStatus: async (
            uuid: string,
            token: string,
            program_id: string,
            volunteer_uuid: string
        ): Promise<{
            action: "checkin"
        } | {
            action: "conflict",
            conflictDetails: {
                email: string,
                phone: string,
                programName: string
            }
        } | {
            action: "checkout",
            checkInTime: number
        }> => {
            return await Fetch.POST.json(this.url, "attendance/volunteer/checkinstatus", {
                uuid,
                token,
                program: program_id,
                volunteer: volunteer_uuid
            })
        },
        checkInVolunteer: async (
            uuid: string,
            token: string,
            program_id: string,
            volunteer_uuid: string,
            date: {
                date: number,
                year: number,
                month: number
            },
            startTime: number
        ): Promise<void> => {
            return await Fetch.POST.json(this.url, "attendance/volunteer/checkin", {
                uuid,
                token,
                program: program_id,
                volunteer: volunteer_uuid,
                date,
                startTime
            })
        },
        checkOutVolunteer: async (
            uuid: string,
            token: string,
            program_id: string,
            volunteer_uuid: string,
            endTime: number,
            note?: string
        ): Promise<void> => {
            return await Fetch.POST.json(this.url, "attendance/volunteer/checkout", {
                uuid,
                token,
                program: program_id,
                volunteer: volunteer_uuid,
                endTime,
                note
            })
        },
        addVolunteerHours: async (
            uuid: string,
            token: string,
            program_id: string,
            volunteer_uuid: string,
            date: {
                date: number,
                month: number,
                year: number
            },
            startTime: number,
            endTime: number,
            note?: string
        ): Promise<void> => {
            return await Fetch.POST.json(this.url, "attendance/volunteer/addhours", {
                uuid,
                token,
                program: program_id,
                volunteer: volunteer_uuid,
                date,
                startTime,
                endTime,
                note
            })
        },
        getVolunteerHours: async (
            uuid: string,
            token: string,
            program_id: string,
            volunteer_uuid: string,
        ): Promise<AbridgedVolunteerAttendanceRecord[]> => {
            return await Fetch.POST.json(this.url, "attendance/volunteer/gethours", {
                uuid,
                token,
                program: program_id,
                volunteer: volunteer_uuid
            })
        },
        deleteVolunteeringSession: async (
            uuid: string,
            token: string,
            program_id: string,
            volunteer_uuid: string,
            record: Omit<AbridgedVolunteerAttendanceRecord, "note" | "hours">
        ): Promise<void> => {
            return await Fetch.POST.json(this.url, "attendance/volunteer/deletehours", {
                uuid,
                token,
                program: program_id,
                volunteer: volunteer_uuid,
                record
            })
        },
        editVolunteeringHours: async (
            uuid: string,
            token: string,
            program_id: string,
            volunteer_uuid: string,
            original_record: Omit<AbridgedVolunteerAttendanceRecord, "hours" | "note">,
            new_record: Omit<AbridgedVolunteerAttendanceRecord, "hours">
        ): Promise<void> => {
            return await Fetch.POST.json(this.url, "attendance/volunteer/edithours", {
                uuid,
                token,
                program: program_id,
                volunteer: volunteer_uuid,
                original: original_record,
                new: new_record
            })
        },
        // STUDENT ATTENDANCE
        checkStudentStatus: async (
            uuid: string,
            token: string,
            program_id: string,
            student_uuid: string,
            week: number    // start from 1 (week 1 is index 0)
        ): Promise<boolean[]> => {
            return await Fetch.POST.json(this.url, "attendance/student/status", {
                uuid,
                token,
                program: program_id,
                student: student_uuid,
                week
            })
        },
        toggleStudentAttendance: async (
            uuid: string,
            token: string,
            program_id: string,
            student_uuid: string,
            date: {
                date: number,
                month: number,
                year: number
            },
            present: boolean     // true if the student is present
        ): Promise<{status: boolean}> => {  // status == true when the operation results in the student being marked present
            return await Fetch.POST.json(this.url, "attendance/student/toggle", {
                uuid,
                token,
                program: program_id,
                student: student_uuid,
                date,
                present
            })
        }
    }
}
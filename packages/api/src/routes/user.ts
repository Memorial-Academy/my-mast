import * as Fetch from "../fetcher";
import type { FullName, Birthday, PendingVolunteerAssignment, ConfirmedVolunteerAssignment, EmergencyContact } from "../../types/user";
import { UserTypes, UserTypesString } from "../../types/userTypes";
import { WeeklySchedule } from "../../types";

export default class User {
    private url = "https://localhost:5000"
    
    constructor(APIUrl: string) {
        this.url = APIUrl
    }

    // /user/<role>/profile
    async profile<T extends UserTypesString>(role: T, uuid: string, token: string): Promise<(
        // volunteer role
        T extends "volunteer" ? {
            name: FullName,
            email: string,
            phone: string,
            birthday: Birthday
        // parent role
        } : (T extends "parent" ? {
            name: FullName,
            email: string,
            phone: string,
            linkedStudents: string[]    
        //student role
        } : {
            // TODO: implement properly
            name: FullName,
            email: string,
            phone: string,
            birthday: Birthday
        })
    )> {
        let data;
        try {
             data = await Fetch.POST.json(this.url, `${role}/profile`, {
                token: token,
                uuid: uuid
            })
        } catch(e) {
            throw e;
        }
        return data;
    }

    // /user/parent/students
    async parentGetStudents(uuid: string, token: string): Promise<UserTypes.Student[]> {
        return await Fetch.POST.json(this.url, "parent/students", {
            uuid,
            token
        })
    }

    // /user/<role>/newenrollment
    async newParentEnrollment(
        uuid: string,
        token: string,
        program: string,
        data: {
            id: string,
            course: number,
            week: number
        }[]
    ): Promise<null> {
        return await Fetch.POST.json(this.url, "parent/newenrollment", {
            uuid,
            token,
            program,
            data
        });
    }

    // /user/volunteer/assignments
    async getVolunteerAssignments(uuid: string, token: string): Promise<{
        pending: PendingVolunteerAssignment[],
        assignments: ConfirmedVolunteerAssignment[]
    }> {
        return await Fetch.POST.json(this.url, "volunteer/assignments", {
            uuid,
            token
        })
    }

    async addStudent(uuid: string, token: string, data: {
        first_name: string,
        last_name: string,
        birthday: string,
        notes: string
    }): Promise<void> {
        return await Fetch.POST.json(this.url, "parent/addstudent", {
            uuid,
            token,
            student_first_name: data.first_name,
            student_last_name: data.last_name,
            student_birthday: data.birthday,
            notes: data.notes
        })
    }

    async deleteStudent(
        uuid: string, 
        token: string,
        student_uuid: string
    ): Promise<void> {
        return await Fetch.POST.json(this.url, "parent/deletestudent", {
            uuid,
            token,
            student: student_uuid
        })
    }

    async checkStudentConflicts(
        uuid: string,
        token: string,
        program: string,    // program id
        enrollments: {
            student: string,    // student uuid
            week: number,       // week number for enrollment
            course: number      // id for the course
        }[]
    ): Promise<{
        conflicts: boolean
        student?: string
    }> {
        return await Fetch.POST.json(this.url, `parent/conflicts`, {
            uuid,
            token,
            program,
            enrollments
        })
    }

    async checkVolunteerConflicts(
        uuid: string,
        token: string,
        program: string,
        weeks: number[]
    ): Promise<{ conflicts: boolean }> {
        return await Fetch.POST.json(this.url, "volunteer/conflicts", {
            uuid,
            token,
            program,
            weeks
        })
    }

    async updateParentProfile(
        uuid: string,
        token: string,
        name: FullName,
        email: string,
        phone: string,
        emergencyContact: EmergencyContact
    ): Promise<void> {
        return await Fetch.POST.json(this.url, "parent/update/profile", {
            uuid,
            token,
            name,
            email,
            phone,
            emergencyContact
        })
    }
    
    async updateVolunteerProfile(
        uuid: string,
        token: string,
        name: FullName,
        email: string,
        phone: string,
        school: string,
        skills: string
    ): Promise<void> {
        return await Fetch.POST.json(this.url, "volunteer/update/profile", {
            uuid,
            token,
            name,
            email,
            phone,
            school,
            skills
        })
    }

    async updateStudents(
        uuid: string,
        token: string,
        studentInfo: {
            uuid: string,
            name: FullName,
            birthday: string,   // YYYY-MM-DD
            notes: string
        }[]
    ): Promise<void> {
        return await Fetch.POST.json(this.url, "parent/update/students", {
            uuid,
            token,
            students: studentInfo
        })
    }
}
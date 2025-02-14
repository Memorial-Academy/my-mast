import * as Fetch from "../fetcher";
import type { FullName, Birthday, ConfirmedEnrollment, PendingVolunteerAssignment, ConfirmedVolunteerAssignment } from "../../types/user";
import { FetchError } from "../../types/error";

export default class User {
    private url = "https://localhost:5000"
    
    constructor(APIUrl: string) {
        this.url = APIUrl
    }

    // /user/<role>/profile
    async profile<T extends "volunteer" | "parent" | "student">(role: T, uuid: string, token: string): Promise<(
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
            linkedStudents: string[]    // Array of student UUID's
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
    async parentGetStudents(uuid: string, token: string): Promise<{
        name: FullName,
        notes: string | null,
        uuid: string,
        birthday: Birthday,
        linkedParent: string,
        enrollments: ConfirmedEnrollment[]
    }[]> {
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
}
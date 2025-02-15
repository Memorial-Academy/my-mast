import { FullName } from "../../types";
import { Program } from "../../types/application";
import { UserTypes } from "../../types/userTypes";
import * as Fetch from "../fetcher";

export default class Admin {
    private url = "https://localhost:5000"
    
    constructor(APIUrl: string) {
        this.url = APIUrl
    }

    // /admin/managedprograms
    async getManagedPrograms(uuid: string, token: string): Promise<Program[]> {
        return await Fetch.POST.json(this.url, "managedprograms", {
            uuid,
            token
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
                student: UserTypes.Student,
                parent: {
                    name: FullName,
                    email: string,
                    phone: string
                }
            }[]
        }[]
    }[]> {
        return await Fetch.POST.json(this.url, "enrollments/students", {
            uuid,
            token,
            program: program_id
        })
    }
}
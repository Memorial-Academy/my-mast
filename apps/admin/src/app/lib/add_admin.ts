"use server";
import sessionInfo from "@mymast/utils/authorize_session";
import API from "./APIHandler";
import { UserTypes, FetchError } from "@mymast/api/Types";

export type SearchForVolunteerReturn = UserTypes.Volunteer | 404 | 409;

export async function searchForVolunteer(email: string, programID: string): Promise<SearchForVolunteerReturn> {
    let auth = (await sessionInfo())!;
    let res;
    try {
        res = await API.Admin.getUserByEmail<UserTypes.Volunteer>(auth!.uuid, auth!.token, email);

        if (res.role != "volunteer") {
            return 404;
        }
    } catch(e) {
        // 404 any errors (likely from an API call)
        console.error(e);
        return 404;
    }

    try {
        let managedPrograms = await API.Admin.getManagedPrograms(auth.uuid, auth.token, res.profile.uuid);
        // ensure no duplicate programs
        for (var program of managedPrograms) {
            if (program.id === programID) {
                return 409;
            }
        }
    } catch(e: any) {
        if ((e as FetchError).code != 404) {
            // essentially using 404 as a generic error code for this function
            return 404;
        }
    }

    // otherwise return user info
    return res.profile;
}

export async function addDirector(program: string, new_admin_uuid: string) {
    let auth = (await sessionInfo())!;
    
    return await API.Admin.addProgramAdmin(auth.uuid, auth.token, program, new_admin_uuid);
}
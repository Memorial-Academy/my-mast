"use server";
import sessionInfo from "@mymast/utils/authorize_session";
import API from "./APIHandler";
import { UserTypes } from "@mymast/api/Types";

export type SearchForVolunteerReturn = UserTypes.Volunteer | 404 | 409;

export async function searchForVolunteer(email: string, programID: string): Promise<SearchForVolunteerReturn> {
    let auth = (await sessionInfo())!;
    try {
        let res = await API.Admin.getUserByEmail<UserTypes.Volunteer>(auth!.uuid, auth!.token, email);

        let managedPrograms = await API.Admin.getManagedPrograms(auth.uuid, auth.token, res.profile.uuid);
        // ensure no duplicate programs
        for (var program of managedPrograms) {
            if (program.id === programID) {
                return 409;
            }
        }

        // otherwise return user info
        return res.profile;
    } catch(e) {
        // 404 any errors (likely from an API call)
        return 404;
    }
}
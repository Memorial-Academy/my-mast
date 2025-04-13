import UserSession from "../models/auth/session.model";
import VolunteerUser from "../models/users/volunteer.model";

export default async function validateSession(uuid: string, token: string, role?: string) {
    // ensure valid role
    if (role && !(role == "volunteer" || role == "parent" || role == "student")) {
        return false;
    }

    // check a session exists with matching criteria
    const session = await UserSession.findOne({uuid: uuid, token: token, role: role});
    return (session ? true : false);
}

export async function validateAdmin(uuid: string) {
    // the only users who should have the ability to have admin priviledges are volunteers
    const user = await VolunteerUser.findOne({uuid: uuid});

    if (user && user.admin > 0) {
        return user.admin;
    } else {
        return 0;
    }
}
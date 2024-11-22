import UserSession from "../models/auth/session.model";

export default async function validateSession(uuid: string, token: string, role: string) {
    // ensure valid role
    if (!(role == "volunteer" || role == "parent")) {
        return false;
    }

    // check a session exists with matching criteria
    const session = await UserSession.findOne({uuid: uuid, token: token, role: role});
    return (session ? true : false);
}
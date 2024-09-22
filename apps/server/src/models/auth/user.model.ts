import { Schema } from "mongoose";
import { AuthDB } from "../../scripts/db";

export const UserRoles = ["parent", "student", "volunteer"]

const AuthUser = AuthDB.model(
    "AuthCredentials",
    new Schema ({
        password: { type: String, required: true},
        email: { type: String, required: true},
        role: { type: String, required: true, enum: UserRoles},
        uuid: { type: String, required: true},
    })
)

export default AuthUser;
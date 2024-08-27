import { Schema } from "mongoose";
import { AuthDB } from "../../db";
import { UserRoles } from "./user.model";

const UserSession  = AuthDB.model(
    "Sessions",
    new Schema ({
        token: { type: String, required: true},
        uuid: { type: String, required: true},
        expires: { type: Number, required: true},
        role: {type: String, enum: UserRoles, required: true }
    })
)

export default UserSession
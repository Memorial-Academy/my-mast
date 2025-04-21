import { Schema } from "mongoose";
import { AuthDB } from "../../scripts/db";
import { UserRoles } from "./user.model";

const UserSession  = AuthDB.model(
    "Sessions",
    new Schema ({
        token: { type: String, required: true},
        uuid: { type: String, required: true},
        expires: { type: Number, required: true},
        role: {type: String, enum: UserRoles, required: true },
        createdAt: {type: Date, expires: 3456000, default: Date.now} // sessions will last for 40 days, or 3456000000 milliseconds
    })
)

export default UserSession;
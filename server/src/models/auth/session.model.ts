import { Schema } from "mongoose";
import { AuthDB } from "../../db";

const UserSession  = AuthDB.model(
    "Sessions",
    new Schema ({
        token: String,
        uuid: String,
        expires: Number
    })
)

export default UserSession
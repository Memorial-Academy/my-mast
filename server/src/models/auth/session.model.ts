import { Schema } from "mongoose";
import { AuthDB } from "../../db";

export const UserSession = AuthDB.model(
    "Sessions",
    new Schema ({
        token: String,
        uuid: String
    })
)
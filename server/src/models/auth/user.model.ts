import { Schema } from "mongoose";
import { AuthDB } from "../../db";

const AuthUser = AuthDB.model(
    "AuthCredentials",
    new Schema ({
        password: String,
        email: String,
        role: { type: String, enum: ["parent", "student", "volunteer"]},
        uuid: String,
    })
)

export default AuthUser;
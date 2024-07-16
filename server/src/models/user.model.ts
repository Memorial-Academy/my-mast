import { Schema } from "mongoose";
import { AuthDB } from "../db";

export const UserModel = AuthDB.model(
    "User",
    new Schema ({
        name: {
            first: String,
            last: String,
        },
        password: String,
        email: String,
        role: { type: String, enum: ["parent", "student", "volunteer"]},
        uuid: String,
        phone: String
    })
)
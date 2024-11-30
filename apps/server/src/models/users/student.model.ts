import { Schema } from "mongoose";
import { UserDB } from "../../scripts/db";

const StudentUser = UserDB.model(
    "Students",
    new Schema ({
        name: {
            first: { type: String, required: true },
            last: { type: String, required: true },
        },
        uuid: { type: String, required: true },
        birthday: { type: {
            day: { type: Number, required: true },
            month: { type: Number, required: true },
            year: { type: Number, required: true },
        }, required: true },
        notes: { type: String, required: false, default: "" },
        linkedParent: { type: String, required: true },
        enrollments: {type: [String], required: false, default: [] }
    })
)

export default StudentUser;
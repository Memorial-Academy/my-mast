import { Schema } from "mongoose";
import { UserDB } from "../../scripts/db";

const StudentUser = UserDB.model(
    "Students",
    new Schema ({
        name: {
            type: {
                first: { type: String, required: true},
                last: { type: String, required: true},
            },
            required: true
        },
        uuid: { type: String, required: true },
        birthday: { type: {
            day: { type: Number, required: true },
            month: { type: Number, required: true },
            year: { type: Number, required: true },
        }, required: true },
        notes: { type: String, required: false, default: "" },
        linkedParent: { type: String, required: true },
        enrollments: {type: [{
            program: { type: String, required: true },
            course: { type: Number, required: true },
            week: { type: Number, required: true },
            id: { type: String, required: true }
        }], required: true, default: [] }
    })
)

export default StudentUser;
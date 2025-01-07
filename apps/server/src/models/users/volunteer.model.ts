import { Schema } from "mongoose";
import { UserDB } from "../../scripts/db";

const VolunteerUser = UserDB.model(
    "Volunteers",
    new Schema({
        name: {
            first: { type: String, required: true },
            last: { type: String, required: true },
        },
        email: { type: String, required: true },
        uuid: { type: String, required: true },
        phone: { type: String, required: true },
        birthday: {
            month: { type: Number, required: true },
            day: { type: Number, required: true },
            year: { type: Number, required: true }
        },
        school: { type: String, required: true },
        admin: {type: Boolean, default: false},
        pendingAssignments: { type: [String], required: true, default: [] },   // assignments yet to be finalized by program director
        assignments: [{     // enrollments that have been finalized by the program director
            program: { type: String, required: true },
            course: { type: Number, required: true },
            week: { type: Number, required: true },
            instructor: { type: Boolean, required: false, default: false },
            id: { type: String, required: true }
        }],
        // enrollments not yet finalized are stored in the `volunteersignups` collection in the `application` database
        skills: { type: String, required: false, default: "" }
    })
)

export default VolunteerUser;
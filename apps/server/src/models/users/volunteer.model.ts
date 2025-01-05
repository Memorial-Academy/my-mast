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
        assignments: [{     // enrollments that have been finalized by the program director
            program: { type: String, required: true },
            course: { type: Number, required: true },
            week: { type: Number, required: true },
            instructor: { type: Boolean, required: true, default: false }
        }],
        // enrollments not yet finalized are stored in the `volunteer__signups` collection in the `application` database
        skills: { type: String, required: false, default: "" }
    })
)

export default VolunteerUser;
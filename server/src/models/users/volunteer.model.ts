import { Schema } from "mongoose";
import { UserDB } from "../../db";

const VolunteerUser = UserDB.model(
    "Volunteers",
    new Schema ({
        name: {
            first: String,
            last: String,
        },
        email: String,
        uuid: String,
        phone: String,
        birthday: {
            month: Number,
            day: Number,
            year: Number
        },
        school: String
    })
)

export default VolunteerUser;
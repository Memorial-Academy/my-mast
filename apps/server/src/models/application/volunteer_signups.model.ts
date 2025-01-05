import { Schema } from "mongoose";
import { ApplicationDB } from "../../scripts/db";

const VolunteerSignup = ApplicationDB.model(
    "VolunteerSignups",
    new Schema({
        uuid: { type: String, required: true }, // uuid for the volunteer
        program: { type: String, required: true },  // program ID for the signup
        courses: { type: [Number], required: true}, // courses interested in volunteering for
        weeks: {type: [Number], required: true}, // weeks volunteering for
        instructorInterest: { type: Boolean, required: true },
        skills: { type: String, required: false, default: "" }
    })
)

export default VolunteerSignup;
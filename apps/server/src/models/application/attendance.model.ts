import { Schema } from "mongoose";
import { ApplicationDB } from "../../scripts/db";

const Attendance = ApplicationDB.model(
    "Attendance",
    new Schema({
        program: { type: String, required: true },
        role: { type: String, required: true, enum: ["volunteer", "student"]},
        uuid: { type: String, required: true },
        date: {
            type: {
                week: { type: Number, required: true },
                year: { type: Number, required: true },
                day: { type: Number, required: true },
                month: { type: Number, required: true },
            },
            required: true
        },
        present: { type: Boolean, required: true, default: false },
        hours: { type: Number, required: false, default: 0 }
    })
)

export default Attendance;
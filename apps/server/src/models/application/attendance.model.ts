import { Schema } from "mongoose";
import { ApplicationDB } from "../../scripts/db";

export const StudentAttendance = ApplicationDB.model(
    "StudentAttendance",
    new Schema({
        program: { type: String, required: true },
        uuid: { type: String, required: true },
        date: {
            type: {
                year: { type: Number, required: true },
                day: { type: Number, required: true },
                month: { type: Number, required: true },
            },
            required: true
        }
    })
)

export const VolunteerAttendance = ApplicationDB.model(
    "VolunteerAttendance",
    new Schema({
        program: { type: String, required: true },
        uuid: { type: String, required: true },
        date: {
            type: {
                year: { type: Number, required: true },
                date: { type: Number, required: true },
                month: { type: Number, required: true },
            },
            required: true
        },
        startTime: { type: Number, required: true },
        endTime: { type: Number, required: true, default: -1 }, // -1 as end time == volunteer has been checked in but not checked out (volunteering time is incomplete)
        hours: { type: Number, required: false, default: 0 },
        note: { type: String , required: false }
    })
)
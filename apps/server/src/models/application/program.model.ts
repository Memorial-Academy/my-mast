import { Schema } from "mongoose";
import { ApplicationDB } from "../../scripts/db";

const Program = ApplicationDB.model(
    "Programs",
    new Schema({
        id: { type: String, required: true },
        name: { type: String, required: true },
        program_type: { type: String, required: true },
        volunteering_hours: { type: {
            total: { type: Number, required: true },
            weekly: { type: [Number], required: true }
        }, required: true },
        location: { type: {
            loc_type: { type: String, required: true, enum: ["physical", "virtual"]},
            
            // only used if type == "physical"
            common_name: { type: String, required: false },
            address: { type: String, required: false },
            city: { type: String, required: false },
            state: { type: String, required: false },
            zip: { type: String, required: false },

            // only used if type == "virtual"
            link: { type: String, required: false}
        }, required: true },
        schedule: { type: [[{
            dayCount: { type: Number, required: true },
            date: { type: Number, required: true },
            month: { type: Number, required: true },
            year: { type: Number, required: true },
            start: { type: Number, required: true },
            end: { type: Number, required: true }
        }]], required: true },
        courses: { type: [{
            id: { type: Number, required: true },
            name: { type: String, required: true },
            duration: { type: Number, required: true },
            available: { type: [Number], required: true }
        }], required: true },
        contact: { type: {
            name: {
                first: { type: String, required: true },
                last: { type: String, required: true }
            },
            phone: { type: String, required: true },
            email: { type: String, required: true }
        }, required: true },
        admins: { type: [String], required: true }, // UUIDs of users able to access the program from Admin Panel
        enrollments: {
            type: {
                // Arrays of enrollment IDs
                volunteers: { type: [String], required: true },
                students: { type: [String], required: true }
            },
            required: true,
            default: {
                volunteers: [],
                students: []
            }
        },
        active: {   // whether the program is still accepting enrollments or not
            type: {
                volunteer: { type: Boolean, required: true },
                student: { type: Boolean, required: true },
            },
            required: true,
            default: {
                volunteer: true,
                student: true
            }
        },
    })
)

export default Program;
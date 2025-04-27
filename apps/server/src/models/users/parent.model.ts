import { Schema } from "mongoose";
import { UserDB } from "../../scripts/db";

const ParentUser = UserDB.model(
    "Parents",
    new Schema ({
        name: {
            type: {
                first: { type: String, required: true},
                last: { type: String, required: true},
            },
            required: true
        },
        email: { type: String, required: true },
        uuid: { type: String, required: true },
        phone: { type: String, required: true },
        linkedStudents: { type: [String], required: true, default: [] },
        emergencyContact: {
            type: {
                name: {
                    type: {
                        first: { type: String, required: true },
                        last: { type: String, required: true }
                    },
                    required: true
                },
                email: { type: String, required: true },
                phone: { type: String, required: true }
            },
            required: true
        }
    })
)

export default ParentUser;
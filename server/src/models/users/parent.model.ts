import { Schema } from "mongoose";
import { UserDB } from "../../db";

const ParentUser = UserDB.model(
    "Parents",
    new Schema ({
        name: {
            first: String,
            last: String,
        },
        email: String,
        uuid: String,
        phone: String,
        linkedStudents: [String]
    })
)

export default ParentUser;
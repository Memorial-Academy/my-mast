import { Schema } from "mongoose";
import { AuthDB } from "../../scripts/db";

const PasswordResetRequest = AuthDB.model(
    "PasswordResetRequests",
    new Schema({
        email: {type: String, required: true},
        token: {type: String, required: true},
        createdAt: {type: Date, expires: "30m", default: Date.now}
    })
)

export default PasswordResetRequest;
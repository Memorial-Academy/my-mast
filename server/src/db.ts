import mongoose from "mongoose";
require("dotenv").config({path: "../.env"});

export function connect() {
    mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:27017`);
}

export function disconnect() {
    mongoose.disconnect();
}

export const AuthDB = mongoose.connection.useDb("auth");

import { UserModel } from "./models/user.model";
export const Auth = {
    user: UserModel
}
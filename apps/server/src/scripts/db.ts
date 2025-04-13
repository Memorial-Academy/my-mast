import mongoose from "mongoose";
require("dotenv").config({path: "../.env"});

const MONGODB_URL = process.env.MONGO_URL;
const DEFAULT_OPTIONS = {
    authSource: "admin",
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD
}

export const AuthDB = mongoose.createConnection(`mongodb://${MONGODB_URL}/auth`, DEFAULT_OPTIONS)

export const UserDB = mongoose.createConnection(`mongodb://${MONGODB_URL}/users`, DEFAULT_OPTIONS)

export const ApplicationDB = mongoose.createConnection(`mongodb://${MONGODB_URL}/application`, DEFAULT_OPTIONS)
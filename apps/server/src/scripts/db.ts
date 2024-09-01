import mongoose from "mongoose";
require("dotenv").config({path: "../.env"});

export const AuthDB = mongoose.createConnection(
    `mongodb://127.0.0.1:27017/auth`, {
        authSource: "admin",
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD
})

export const UserDB = mongoose.createConnection(
    `mongodb://127.0.0.1:27017/users`, {
        authSource: "admin",
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD
})
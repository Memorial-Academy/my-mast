import Mongoose from "mongoose";
require("dotenv").config({path: "../.env"});

export function connect() {
    Mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:21000`)
}
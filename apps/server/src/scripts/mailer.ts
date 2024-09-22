import * as Nodemailer from "nodemailer";
require("dotenv").config();

const transporter = Nodemailer.createTransport({
    pool: true,
    host: process.env.MAIL_URL,
    port: parseInt(process.env.MAIL_PORT!),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})

transporter.on("idle", () => {console.log("success")})

export function sendMail() {
    
}
import * as Nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
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

transporter.on("idle", () => {console.log("Nodemailer connected successfully")})

let pendingEmails: Mail.Options[] = new Array<Mail.Options>();

export function sendMail(
    to: string,
    subject: string,
    content: string,
) {
    pendingEmails.push({
        from: "Memorial Academy of Science and Technology <notifications@memorialacademy.org>",
        to: to,
        subject: subject,
        html: content
    })
}


setInterval(() => {
    if (pendingEmails.length > 0) {
        let email = pendingEmails.shift()!;
        console.log("sending email with subject " + email.subject);

        transporter.sendMail(email, (err, info) => {
            if (err) console.error(err);
            else console.log("sent");
        })
    }
}, 5000)
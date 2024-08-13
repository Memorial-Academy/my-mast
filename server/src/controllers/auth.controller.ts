import { Request, Response } from "express";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import AuthUser from "../models/auth/user.model";
import ParentUser from "../models/users/parent.model";
import VolunteerUser from "../models/users/volunteer.model";
import UserSession from "../models/auth/session.model";

function authenticationError(res: Response, err: string | Error) {
    console.error(err);
    res.writeHead(500);
    res.end(err);
}

function generateSession(uuid: string, role: string) {
    let sessionToken = randomBytes(25).toString("hex");

    // calculate session expiry date
    // sessions will last for 40 days, or 3456000000 milliseconds
    let sessionExpiry = Date.now() + 3456000000;
    
    UserSession.create({
        uuid: uuid,
        token: sessionToken,
        expires: sessionExpiry,
        role: role
    })

    return { sessionToken, sessionExpiry };
}

export async function loginHandler(req: Request, res: Response) {
    let user = await AuthUser.findOne({
        email: req.body.email
    });

    if (!user) {
        res.writeHead(401);
        res.end("Account does not exist");
        return;
    }

    bcrypt.compare(req.body.password, user.password, (err, match) => {
        if (err) console.error(err);
        
        if (match) {
            let session = generateSession(user.uuid, user.role);
            res.writeHead(200);
            res.end(JSON.stringify(session));
        }
    })
}

export function logoutHandler(req: Request, res: Response) {
    UserSession.deleteOne({
        token: req.body
    }).then(() => {
        res.writeHead(200);
        res.end();
    });   
}

export function signupHandler(req: Request, res: Response) {
    // Ensure ToS and Privacy agreement
    if (req.body.agreement != "agree") {
        authenticationError(res, "Agree to Terms of Service and Privacy Policy");
        return;
    }

    // Hash & salt password
    bcrypt.genSalt(10, (err, salt) => {
        if (err) authenticationError(res, err);

        bcrypt.hash(req.body.password, salt, async (err, hash) => {

            if (err) authenticationError(res, err);

            if (await AuthUser.findOne({email: req.body.email})) {
                authenticationError(res, "Could not create account");
                return;
            }

            var id = randomBytes(32).toString("hex");
            // console.log(req.body)
            // Add data to the user authentication datbase
            AuthUser.create({
                password: hash,
                email: req.body.email,
                role: req.body.role,
                uuid: id
            })

            // Add data to the correct user database for all user info
            // Parent account
            if (req.body.role == "parent") {
                ParentUser.create({
                    name: {
                        first: req.body.first_name,
                        last: req.body.last_name
                    },
                    email: req.body.email,
                    uuid: id,
                    phone: req.body.phone_number,
                    linkedStudents: []
                })
            } else if (req.body.role == "volunteer") {
                let bday = req.body.birthday.split("-"); // req.body.birthday is formatted as YYYY-MM-DD
                VolunteerUser.create({
                    name: {
                        first: req.body.first_name,
                        last: req.body.last_name
                    },
                    email: req.body.email,
                    uuid: id,
                    phone: req.body.phone_number,
                    birthday: {
                        month: parseInt(bday[1]),
                        day: parseInt(bday[2]),
                        year: parseInt(bday[0])
                    }
                })
            }

            let session = generateSession(id, req.body.role);

            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify(session));
        })
    })
}
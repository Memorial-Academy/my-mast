import { Request, Response } from "express";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import AuthUser from "../models/auth/user.model.js";
import ParentUser from "../models/users/parent.model.js";
import VolunteerUser from "../models/users/volunteer.model.js";
import UserSession from "../models/auth/session.model.js";
import PasswordResetRequest from "../models/auth/password_reset.js";
import { validateEmail, validatePhoneNumber } from "../scripts/input_validation.js";

function authenticationError(res: Response, err: string | Error) {
    console.error(err);
    res.writeHead(500);
    res.end(err);
}

async function generateSession(uuid: string, role: string) {
    let sessionToken = randomBytes(35).toString("hex");

    // calculate session expiry date
    // sessions will last for 40 days, or 3456000000 milliseconds
    let sessionExpiry = Date.now() + 3456000000;
    
    await UserSession.create({
        uuid: uuid,
        token: sessionToken,
        expires: sessionExpiry,
        role: role
    })

    return { sessionToken, sessionExpiry, uuid };
}

export async function loginHandler(req: Request, res: Response) {
    if (!validateEmail(req.body.email)) {
        authenticationError(res, "Please enter a valid email address.");
        return;
    }
    
    let user = await AuthUser.findOne({
        email: req.body.email
    });

    // Account does not exist
    if (!user) {
        res.writeHead(401);
        res.end("Could not login. Make sure the email and password are correct.");
        return;
    }

    bcrypt.compare(req.body.password, user.password, async (err, match) => {
        if (err) console.error(err);
        
        if (match) {
            let session = await generateSession(user.uuid, user.role);
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify(session));
        } else {
            res.writeHead(403);
            res.end();
        }
    })
}

export function logoutHandler(req: Request, res: Response) {
    UserSession.deleteOne({
        token: req.body
    })
    .then(() => {
        res.writeHead(200);
        res.end();
    })
    .catch((err) => {
        console.error(err);
    })  
}

export function signupHandler(req: Request, res: Response) {
    // Ensure ToS and Privacy agreement
    if (req.body.agreement != "agree") {
        authenticationError(res, "Agree to Terms of Service and Privacy Policy");
        return;
    }
    if (!validateEmail(req.body.email)) {
        authenticationError(res, "Please enter a valid email address.");
        return;
    } else if (!validatePhoneNumber(req.body.phone_number)) {
        authenticationError(res, "Please enter a valid phone number.");
        return;
    }

    // Hash & salt password
    bcrypt.genSalt(10, (err, salt) => {
        if (err) authenticationError(res, err);

        bcrypt.hash(req.body.password, salt, async (err, hash) => {

            if (err) authenticationError(res, err);

            if (await AuthUser.findOne({email: req.body.email})) {
                authenticationError(res, "Could not create account; please try again. If you already have an account, please try resetting your password.");
                return;
            }

            var id = randomBytes(32).toString("hex");
            
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

            let session = await generateSession(id, req.body.role);

            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify(session));
        })
    })
}

export async function getSession(req: Request, res: Response) {
    const session = await UserSession.findOne({
        token: req.body
    });
    
    // Exit if no session exists
    if (!session) {
        res.writeHead(404);
        res.end();
        return;
    }

    if (session.expires <= Date.now()) {
        UserSession.deleteOne({session});
        res.writeHead(404);
        res.end();
        return;
    }

    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
        uuid: session.uuid,
        role: session.role
    }));
}

export async function resetPassword(req: Request, res: Response) {
    var resetRequst = await PasswordResetRequest.findOne({token: req.body.token});

    if (resetRequst) {
        let user = (await AuthUser.findOne({email: resetRequst!.email}))!;
        
        await PasswordResetRequest.deleteOne({token: req.body.token});

        bcrypt.genSalt(10, (err, salt) => {
            if (err) authenticationError(res, err);

            bcrypt.hash(req.body.password, salt, async (err, hash) => {
                if (err) authenticationError(res, err);
                
                user.password = hash;
                user.save();
            })
        })

        await UserSession.deleteMany({uuid: user.uuid});

        res.writeHead(200);
    } else {
        res.writeHead(403);
    }

    res.end();
}

export async function initiatePasswordReset(req: Request, res: Response) {
    res.writeHead(200);

    // check user exists
    if (!await AuthUser.findOne({email: req.body})) {
        console.log("Password reset request for unknown user: " + req.body);
        res.end();
        return;
    } else {
        console.log("Password reset request for: " + req.body);
    };

    // generate password reset request
    var token: string;
    var existingRequest = await PasswordResetRequest.findOne({email: req.body});
    if (existingRequest) {
        token = existingRequest.token;
    } else {
        token = randomBytes(25).toString("hex");
        PasswordResetRequest.create({
            email: req.body,
            token: token
        });
    }

    console.log(token)
    res.end();
}
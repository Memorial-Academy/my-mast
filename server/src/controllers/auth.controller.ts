import { Request, Response } from "express";
import { Auth } from "../db";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";

export function loginHandler(req: Request, res: Response) {
    console.log(req.body);
    res.end();
}

export function logoutHandler(req: Request, res: Response) {

}

export function signupHandler(req: Request, res: Response) {
    try {
        if (req.body.agreement != "on") {
            throw "Could not create account";
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;

            bcrypt.hash(req.body.password, salt, async (err, hash) => {

                if (err) throw err;

                if (await Auth.user.findOne({email: req.body.email})) {
                    throw "Could not create account";
                }

                var id = randomBytes(25).toString("hex");
                console.log("Adding record")
                Auth.user.create({
                    name: {
                        first: req.body.first_name,
                        last: req.body.last_name
                    },
                    password: hash,
                    email: req.body.email,
                    role: req.body.role,
                    uuid: id,
                    phone: req.body.phone
                })           
                res.writeHead(200);
                res.end();
            })
        })
    } catch(err) {
        console.log(err)
        res.writeHead(500);
        res.end(err)
    }
}
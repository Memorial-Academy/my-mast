import { Request, Response } from "express";
import ParentUser from "../models/users/parent.model";
import VolunteerUser from "../models/users/volunteer.model";

export async function profileInfo(req: Request, res: Response) {
    // the user ID used to authenticate the request (middleware) is the same used in the database search
    switch (req.params.role) {
        case "volunteer":
            res.writeHead(200);
            res.end(
                JSON.stringify( await VolunteerUser.findOne({uuid: req.body.uuid}, {
                    "name": 1,
                    "email": 1,
                    "phone": 1,
                    "birthday": 1,
                    "_id": 0
                }))
            );
            break;
        case "parent":
            res.writeHead(200);
            res.end(
                JSON.stringify( await ParentUser.findOne({uuid: req.body.uuid}, {
                    "name": 1,
                    "email": 1,
                    "phone": 1,
                    "linkedStudents": 1,
                    "_id": 0
                }))
            );
            break;
        default:
            res.writeHead(404);
            res.end();
    }   
}
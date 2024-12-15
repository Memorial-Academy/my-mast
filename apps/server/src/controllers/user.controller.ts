import { Request, Response } from "express";
import ParentUser from "../models/users/parent.model";
import VolunteerUser from "../models/users/volunteer.model";
import StudentUser from "../models/users/student.model";

function checkRole(correctRole: string, req: Request, res: Response) {
    if (req.params.role != correctRole) {
        res.writeHead(404);
        res.end();
        return false;
    } else return true;
}

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

export async function getStudents(req: Request, res: Response) {
    // endpoint is only for parent role
    if (!checkRole("parent", req, res)) return;

    const students = await StudentUser.find({linkedParent: req.body.uuid}, {
        "_id": 0,
        "__v": 0
    });

    if (students) {
        res.writeHead(200);
        res.end(JSON.stringify(students));
    } else {
        res.writeHead(404);
        res.end();
    }
}

export async function newEnrollment(req: Request, res: Response) {
    if (!checkRole("parent", req, res)) return;
    
    const enrollmentData = req.body.data;
    
    for (var enrollment of enrollmentData) {
        let student = await StudentUser.findOne({uuid: enrollment.id})!;

        if (!student) {
            res.writeHead(500);
            res.end(`Student "${enrollment.id}" does not exist`);
            return;
        }

        if (student.linkedParent != req.body.uuid) {
            res.writeHead(403);
            res.end(`Parent user "${req.body.uuid}" is not linked to the student user "${student.uuid}"`);
            return;
        }
        
        student.enrollments.push({
            program: req.body.program,
            course: enrollment.class,
            week: enrollment.week
        })

        student.save();
    }

    res.writeHead(200);
    res.end();
}
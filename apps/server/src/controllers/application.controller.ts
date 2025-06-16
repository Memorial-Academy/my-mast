import { Request, Response } from "express";
import Program from "../models/application/program.model";

export async function getProgram(req: Request, res: Response) {
    const program = await Program.findOne({id: req.params.id}, {
        "_id": 0,
        "enrollments": 0
    });

    if (program) {
        res.writeHead(200, {
            "content-type": "application/json"
        });
        res.end(JSON.stringify(program));
    } else {
        res.writeHead(404, {
            "content-type": "text/plain"
        });
        res.end("No program found");
    }
}

export async function getAllPrograms(req: Request, res: Response) {
    const programs = await Program.find({active: true}, {
        "_id": 0,
        "enrollments": 0,
        "admins": 0,
        "volunteering_hours": 0
    });

    res.writeHead(200);
    res.end(JSON.stringify(programs));
}
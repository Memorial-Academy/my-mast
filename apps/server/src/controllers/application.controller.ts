import { Request, Response } from "express";
import Program from "../models/application/program.model";

export async function getProgram(req: Request, res: Response) {
    const program = await Program.findOne({id: req.params.id}, {
        "_id": 0
    });

    if (program) {
        res.writeHead(200);
        res.end(JSON.stringify(program));
    } else {
        res.writeHead(404);
        res.end("No program found");
    }
}
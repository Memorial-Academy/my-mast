import { Request, Response } from "express";
import Program from "../models/application/program.model";
import { randomBytes } from "crypto";

function validateData(data: any, res: Response) {
    if (data) {
        return data;
    } else {
        res.writeHead(400);
        res.end("Ensure all required information is submitted");
        return;
    }
}

export function createProgram(req: Request, res: Response) {
    const submitted = req.body.data;

    // Check all required information categories are provided
    for (var key of Object.keys(submitted)) {
        if (!submitted[key]) {
            res.writeHead(400);
            res.end("Ensure all required information is submitted");
            return;
        }
    }

    // generate unique ID
    const id = randomBytes(12).toString("hex");
    console.log(id);
    
    // create object for schedule information

    // add to database
    Program.create({
        id: id,
        name: submitted.name,
        location: {
            loc_type: submitted.location.type,
            common_name: submitted.location.common_name,
            address: submitted.location.address,
            city: submitted.location.city,
            state: submitted.location.state,
            zip: submitted.location.zip
        },
        schedule: submitted.schedule,
        contact: submitted.contact,
        courses: submitted.courses
    })

    res.writeHead(200);
    res.end(id);
}
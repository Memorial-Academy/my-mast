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
    
    // determine if the program is for Let's Code or STEMpark
    let programType: string;
    let programName = submitted.name.toLowerCase();
    if (programName.indexOf("let's code") > -1) {
        programType = "letscode";
    } else if (programName.indexOf("stempark")> -1) {
        programType = "stempark";
    } else {
        res.writeHead(400);
        res.end("Ensure all required information is submitted");
        return;
    }

    // calculate total and weekly volunteering hours
    let totalVolunteering = 0;
    let weeklyHours = new Array<number>(submitted.schedule.length);
    for (var i = 0; i < submitted.schedule.length; i++) {
        weeklyHours[i] = 0;
        for (var day of submitted.schedule[i]) {
            weeklyHours[i] += day.end - day.start;
        }
        totalVolunteering += weeklyHours[i];
        console.log(weeklyHours)
    }

    // generate IDs for courses
    let coursesSubmitted = validateData(submitted.courses, res);
    let courses = [];

    for (var i = 0; i < coursesSubmitted.length; i++) {
        courses.push({
            id: i,
            name: coursesSubmitted[i].name,
            duration: coursesSubmitted[i].duration,
            available: coursesSubmitted[i].available,
        })
    }

    // add to database
    Program.create({
        id: id,
        name: validateData(submitted.name, res), 
        program_type: programType,
        location: {
            loc_type: validateData(submitted.location.type, res),
            common_name: submitted.location.common_name,
            address: submitted.location.address,
            city: submitted.location.city,
            state: submitted.location.state,
            zip: submitted.location.zip
        },
        schedule: validateData(submitted.schedule, res),
        contact: validateData(submitted.contact, res),
        courses: courses,
        volunteering_hours: {
            total: totalVolunteering,
            weekly: weeklyHours
        }
    })

    res.writeHead(200);
    res.end(id);
}
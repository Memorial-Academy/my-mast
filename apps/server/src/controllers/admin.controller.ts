import { Request, Response } from "express";
import Program from "../models/application/program.model";
import { randomBytes } from "crypto";
import AuthUser from "../models/auth/user.model";
import VolunteerUser from "../models/users/volunteer.model";
import ParentUser from "../models/users/parent.model";

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
    }

    // generate IDs for courses
    let coursesSubmitted = validateData(submitted.courses, res);
    let courses = [];

    for (var i = 0; i < coursesSubmitted.length; i++) {
        courses.push({
            id: i,
            name: validateData(coursesSubmitted[i].name, res),
            duration: validateData(coursesSubmitted[i].duration, res),
            available: validateData(coursesSubmitted[i].available, res)
        })
    }

    let locationData;
    validateData(submitted.location.type, res)
    if (submitted.location.type == "physical") {
        locationData = {
            loc_type: "physical",
            common_name: validateData(submitted.location.common_name, res),
            address: validateData(submitted.location.address, res),
            city: validateData(submitted.location.city, res),
            state: validateData(submitted.location.state, res),
            zip: validateData(submitted.location.zip, res)
        }
    } else if (submitted.location.type == "virtual") {
        locationData = {
            loc_type: "virtual",
            link: ""
        }
    }

    // add to database
    Program.create({
        id: id,
        name: validateData(submitted.name, res), 
        program_type: programType,
        location: locationData,
        schedule: validateData(submitted.schedule, res),
        contact: validateData(submitted.contact, res),
        courses: courses,
        volunteering_hours: {
            total: totalVolunteering,
            weekly: weeklyHours
        },
        admins: [
            req.body.uuid
        ],
        active: {
            type: {
                volunteer: Boolean,
                student: Boolean,
            },
            required: true,
            default: {
                volunteer: true,
                student: true
            }
        }
    })

    res.writeHead(200);
    res.end(id);
}

export async function getManagedPrograms(req: Request, res: Response) {
    let programs = await Program.find({admins: req.body.uuid}, {
        "_id": 0
    });
    
    if (programs.length > 0) {
        res.writeHead(200);
        res.end(JSON.stringify(programs));
    } else {
        res.writeHead(404);
        res.end("No programs found");
    }
}

export async function getUser(req: Request, res: Response) {
    let userInfo = await AuthUser.findOne({uuid: req.body.requested_uuid});

    if (!userInfo) {
        res.writeHead(404);
        res.end(`User "${req.body.requested_uuid}" does not exist`);
        return;
    }

    let profile;

    if (userInfo.role == "volunteer") {
        profile = await VolunteerUser.findOne({uuid: userInfo.uuid});
    } else if (userInfo.role == "parent") {
        profile = await ParentUser.findOne({uuid: userInfo.uuid});
    } else {
        res.writeHead(500);
        res.end(`User "${userInfo.uuid} has an invalid role "${userInfo.role}"`);
        return;
    }

    profile = profile!.toJSON();
    
    res.end(JSON.stringify({
        role: userInfo.role,
        profile
    }))
}
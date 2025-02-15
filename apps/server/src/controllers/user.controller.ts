import { Request, Response } from "express";
import ParentUser from "../models/users/parent.model";
import VolunteerUser from "../models/users/volunteer.model";
import StudentUser from "../models/users/student.model";
import VolunteerSignup from "../models/application/volunteer_signups.model";
import { randomBytes } from "crypto";
import Program from "../models/application/program.model";

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

function generateEnrollmentID(uuid: string) {
    return `${uuid}_e:${randomBytes(10).toString("hex")}`;
}

export async function newEnrollment(req: Request, res: Response) {
    const enrollmentData = req.body.data;
    let program = await Program.findOne({id: req.body.program});

    if (!program) {
        res.writeHead(404);
        res.end("No program found");
        return;
    }
    
    if (req.params.role == "parent") {  // Create new enrollments for students (via a parent account)
        for (var enrollment of enrollmentData) {
            let student = await StudentUser.findOne({uuid: enrollment.id});
    
            if (!student) {
                res.writeHead(404);
                res.end(`Student "${enrollment.id}" does not exist`);
                return;
            }

            let enrollmentID = generateEnrollmentID(student.uuid);
    
            if (student.linkedParent != req.body.uuid) {
                res.writeHead(403);
                res.end(`Parent "${req.body.uuid}" is not linked to the student "${student.uuid}"`);
                return;
            }
            
            student.enrollments.push({
                program: req.body.program,
                course: enrollment.class,
                week: enrollment.week,
                id: enrollmentID
            })
    
            student.save();

            program.enrollments.students.push(enrollmentID);
        }
    } else if (req.params.role == "volunteer") { // Create new enrollment for volunteers
        let volunteer = await VolunteerUser.findOne({uuid: req.body.uuid});
        let enrollmentID = generateEnrollmentID(req.body.uuid);

        if (!volunteer) {
            res.writeHead(404);
            res.end(`Volunteer "${req.body.uuid}" does not exist`);
            return;
        }

        VolunteerSignup.create({
            uuid: volunteer.uuid,
            program: req.body.program,
            courses: enrollmentData.courses,
            weeks: enrollmentData.weeks,
            instructorInterest: enrollmentData.instructor,
            skills: enrollmentData.skills,
            id: enrollmentID
        })

        volunteer.pendingAssignments.push(enrollmentID);
        volunteer.save();
        
        program.enrollments.volunteers.push(enrollmentID);
    } else {
        res.writeHead(404);
        res.end(`"${req.params.role}" is not a valid role`);
    }

    program.save();

    res.writeHead(200);
    res.end();
}

export async function getAssignments(req: Request, res: Response) {
    if (!checkRole("volunteer", req, res)) return;

    const volunteer = await VolunteerUser.findOne({uuid: req.body.uuid}, {
        "pendingAssignments": 1,
        "assignments": 1,
        "_id": 0
    });

    if (!volunteer) {
        res.writeHead(404);
        res.end(`User "${req.body.uuid}" does not exist.`);
        return;
    }

    let pendingAssignments = [];

    for (let pa of volunteer.pendingAssignments) {
        let signup = await VolunteerSignup.findOne({id: pa});

        if (!signup) {
            res.writeHead(500);
            res.end(`User "${req.body.uuid}" has not signed-up for a program using enrollment ID "${pa}"`);
            return;
        }

        let hours = 0;

        let weeklyHourAllowance = (await Program.findOne({id: signup.program}, {
            "volunteering_hours": 1
        }))!.volunteering_hours.weekly

        signup.weeks.forEach(week => {
            hours += weeklyHourAllowance[week - 1];
        })

        pendingAssignments.push({
            program: signup.program,
            courses: signup.courses,
            weeks: signup.weeks,
            instructor: signup.instructorInterest,
            hours: hours
        })
    }

    res.end(JSON.stringify({
        pending: pendingAssignments,
        assignments: volunteer.assignments
    }));
    return;
}
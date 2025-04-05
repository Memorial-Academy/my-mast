import { Request, Response } from "express";
import Program from "../models/application/program.model";
import { randomBytes } from "crypto";
import AuthUser from "../models/auth/user.model";
import VolunteerUser from "../models/users/volunteer.model";
import ParentUser from "../models/users/parent.model";
import StudentUser from "../models/users/student.model";
import VolunteerSignup from "../models/application/volunteer_signups.model";
import Attendance from "../models/application/attendance.model";

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

export async function getStudentEnrollments(req: Request, res: Response) {
    // get data on the requested program
    let programData = await Program.findOne({ id: req.body.program });

    if (!programData) {
        res.writeHead(404);
        res.end(`Program "${req.body.program}" does not exist`);
        return;
    }

    let data = [];  // this array 

    // loop through all the courses for the program
    for (var course of programData.courses) {
        let courseEnrollments = {
            courseID: course.id,
            total: 0,
            data: new Array()
        };

        // loop through each week of the course
        for (var week of course.available) {
            // get all students enrolled in the course for the specified week
            let studentParentPairs = [];
            let students = await StudentUser.find({
                enrollments: { $elemMatch: {    // match all student users that are...
                    program: req.body.program,  // enrolled in the requested program
                    course: course.id,          // enrolled in the course found in `course`
                    week: week                  // enrolled in the week found in `week`
                }}
            }, {
                "enrollments": 0,
                "_id": 0
            })

            for (var student of students) {
                let parent = await ParentUser.findOne({uuid: student.linkedParent}, {
                    "linkedStudents": 0,
                    "_id": 0
                });
        
                studentParentPairs.push({
                    student,
                    parent
                })
            }

            let weeklyEnrollments = {
                week: week,
                enrollments: studentParentPairs
            }
            courseEnrollments.total += weeklyEnrollments.enrollments.length;
            courseEnrollments.data.push(weeklyEnrollments);
        }

        // add course data to the general program data array
        data.push(courseEnrollments);
    }

    res.writeHead(200);
    res.end(JSON.stringify(data));
}

export async function getVolunteerSignups(req: Request, res: Response) {
    // get all pending assignments
    let pendingAssignmentsData = await VolunteerSignup.find({program: req.body.program});

    let pendingVolunteers = []

    for (let pa of pendingAssignmentsData) {
        pendingVolunteers.push({
            volunteer: await VolunteerUser.findOne({uuid: pa.uuid}, {
                "assignments": 0,
                "pendingAssignments": 0,
                "_id": 0,
                "admin": 0
            }),
            signup: pa
        })
    }

    // get confirmed assignments
    // TODO: implement
    let confirmedAssignments = await VolunteerUser.find({
        assignments: { 
            $elemMatch: {
                program: req.body.program
            }
        }
    });

    let confirmedVolunteers = [];

    for (let volunteer of confirmedAssignments) {
        // get specific signup object
        let signup;

        for (let assignment of volunteer.assignments) {
            if (assignment.program == req.body.program) {
                signup = assignment;
            }
        }

        confirmedVolunteers.push({
            volunteer: await VolunteerUser.findOne({uuid: volunteer.uuid}, {
                "assignments": 0,
                "pendingAssignments": 0,
                "_id": 0,
                "admin": 0
            }),
            signup: signup
        })
    }

    res.writeHead(200);
    res.end(JSON.stringify({
        total: {
            pending: pendingVolunteers.length,
            confirmed: confirmedVolunteers.length
        },
        pendingAssignments: pendingVolunteers,
        confirmedAssignments: confirmedVolunteers
    }))
}

export async function confirmVolunteerAssignment(req: Request, res: Response) {
    // delete pending signup
    // do this first to avoid edge cases where assignment is pending and confirmed
    const deletion = VolunteerSignup.deleteOne({id: req.body.enrollment});

    // find volunteer
    const volunteer = await VolunteerUser.findOne({uuid: req.body.volunteer});

    if (!volunteer) {
        res.writeHead(404);
        res.end(`Volunteer "${req.body.volunteer}" does not exist.`);
        return;
    }

    // update volunteer assignment
    volunteer.assignments.push({
        program: req.body.program,
        commitments: req.body.data,
        id: req.body.enrollment,
        hours: 0
    })

    // remove pending assignment from volunteer
    let removeIndex = volunteer.pendingAssignments.indexOf(req.body.enrollment);
    volunteer.pendingAssignments.splice(removeIndex, 1);

    volunteer.save();
    console.log("saved")

    deletion.finally(() => {
        console.log("deleted")
        res.writeHead(200);
        res.end();
    })
}
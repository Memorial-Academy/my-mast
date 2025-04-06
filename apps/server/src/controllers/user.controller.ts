import { Request, Response } from "express";
import ParentUser from "../models/users/parent.model";
import VolunteerUser from "../models/users/volunteer.model";
import StudentUser from "../models/users/student.model";
import VolunteerSignup from "../models/application/volunteer_signups.model";
import { randomBytes } from "crypto";
import Program from "../models/application/program.model";
import { Templates } from "../scripts/pug_handler";
import { sendMail } from "../scripts/mailer";

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

export async function newEnrollment(req: Request, res: Response) {  // for students and parents
    const enrollmentData = req.body.data;
    let program = await Program.findOne({id: req.body.program});
    let schedule = await Program.findOne({id: req.body.program})

    if (!program) {
        res.writeHead(404);
        res.end("No program found");
        return;
    }
    
    if (req.params.role == "parent") {  // Create new enrollments for students (via a parent account)
        let parent = await ParentUser.findOne({uuid: req.body.uuid});
        
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

            let emailThread = new Promise(resolve => {
                let course = program.courses[enrollment.class];

                // get location information
                let location;
                if (program.location.loc_type == "virtual") {
                    location = {
                        type: "virtual"
                    }
                } else {
                    location = {
                        type: "physical",
                        address: `${program.location.address}, ${program.location.city}, ${program.location.state} ${program.location.zip}`,
                        name: program.location.common_name
                    }
                }

                // determine session
                let start = enrollment.week - 1;
                let end = start + (course.duration - 1);

                let schedule = program.schedule.map(week => week.toObject());
                let startWeek = Array.from(Object.values(schedule[start])) as any;
                let sessionStr = `Week ${start + 1} (${startWeek[0].month}/${startWeek[0]?.date} - ${startWeek[startWeek.length - 1]?.month}/${startWeek[startWeek.length - 1].date})`;
                if (start != end) {
                    let endWeek = Array.from(Object.values(schedule[end])) as any;
                    sessionStr += ` thru Week ${end + 1} (${endWeek[0]?.month}/${endWeek[0]?.date} - ${endWeek[endWeek.length - 1]?.month}/${endWeek[endWeek.length - 1].date})`
                }

                let confirmationEmail = Templates.StudentEnrollment({
                    parent: parent?.name.first,
                    student: {
                        first: student.name.first,
                        last: student.name.last
                    },
                    program: program.name,
                    course: course.name,
                    location: location,
                    session: sessionStr,
                    email: program.program_type == "stempark" ? "stempark@memorialacademy.org" : "letscode@memorialacademy.org"
                })

                sendMail(
                    parent!.email!,
                    `Enrollment Confirmation - ${student.name.first} ${student.name.last} - ${program.name}`,
                    confirmationEmail
                )
            })
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
            break;
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
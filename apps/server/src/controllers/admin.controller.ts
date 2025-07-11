import { Request, Response } from "express";
import Program from "../models/application/program.model";
import { randomBytes } from "crypto";
import AuthUser from "../models/auth/user.model";
import VolunteerUser from "../models/users/volunteer.model";
import ParentUser from "../models/users/parent.model";
import StudentUser from "../models/users/student.model";
import VolunteerSignup from "../models/application/volunteer_signups.model";
import { permissionCheck, PERMISSIONS } from "../scripts/admin_permissions";
import adminProgramSignup from "../scripts/admin_program_signup";
import { Templates } from "../scripts/pug_handler";
import { sendMail } from "../scripts/mailer";
import { unenrollStudent, unenrollVolunteer } from "../scripts/unenroll";
import { StudentAttendance, VolunteerAttendance } from "../models/application/attendance.model";
import { validateData } from "../scripts/input_validation";
import { ProgramsDocument, StudentsDocument, VolunteersDocument } from "../types/mongoose.gen";

export function createProgram(req: Request, res: Response) {
    if (!permissionCheck(res, PERMISSIONS.DIRECTOR)) return;

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
    } else {
        locationData = {
            loc_type: "virtual",
            link: ""
        }
    }

    // add to database
    let createProgramPromise = new Promise<void>(async resolve => {
        await Program.create({
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
            enrollments: {
                students: [],
                volunteers: []
            },
            active: (submitted.schedule as Array<any>).map((val, i) => {
                return true;
            })
        })

        adminProgramSignup(req.body.uuid, id);
        resolve();
    })

    createProgramPromise.finally(() => {
        res.writeHead(200);
        res.end(id);
    })
}

export async function getManagedPrograms(req: Request, res: Response) {
    let requestedUUIDPresent = Object.keys(req.body).indexOf("requested_uuid") > -1;
    if (requestedUUIDPresent && !permissionCheck(res, PERMISSIONS.DIRECTOR)) return;

    let programs = await Program.find({admins: (requestedUUIDPresent ? req.body.requested_uuid : req.body.uuid)}, {
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
                "_id": 0
            }).lean();

            for (var student of students) {
                let parent = await ParentUser.findOne({uuid: student.linkedParent}, {
                    "linkedStudents": 0,
                    "_id": 0
                });

                // get enrollment id
                let enrollmentID = "";
                for (var enrollment of student.enrollments) {
                    if (
                        enrollment.program == req.body.program &&
                        enrollment.course == course.id &&
                        enrollment.week == week 
                    ) {
                        enrollmentID = enrollment.id;
                        break;
                    }
                }
                // get rid of the enrollment objkect before sending it to the response
                delete (student as any).enrollments;
        
                studentParentPairs.push({
                    student,
                    parent,
                    enrollmentID
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
        hours: 0,
        signupNotes: req.body.signupNotes || ""
    })

    // remove pending assignment from volunteer
    let removeIndex = volunteer.pendingAssignments.indexOf(req.body.enrollment);
    volunteer.pendingAssignments.splice(removeIndex, 1);
    volunteer.save();

    let emailThread = new Promise<void>(async resolve => {
        let program = (await Program.findOne({id: req.body.program}))!

        // // only send this email if there are mutliple courses to be assigned to
        // if (program.courses.length == 1) {
        //     resolve();
        //     return;
        // }

        // get location
        let location: {
            type: "virtual" | "physical",
            address?: string,
            name?: string
        };
        if (program.location.loc_type == "virtual") {
            location = {
                type: "virtual"
            }
        } else {
            location = {
                type: "physical",
                address: `${program.location.address!}, ${program.location.city!}, ${program.location.state!} ${program.location.zip!}`,
                name: program.location.common_name! || ""
            }
        }

        // format commitments
        let commitments = [];
        for (var commitment of req.body.data) {
            let week = Array.from(Object.values(program.schedule[commitment.week - 1].toObject())) as any;
            commitments.push({
                week: commitment.week,
                courseName: program.courses[commitment.course].name,
                instructor: commitment.instructor,
                startDate: `${week[0].month}/${week[0].date}`,
                endDate: `${week.at(-1).month}/${week.at(-1).date}`
            })
        }

        let confirmationEmail = Templates.ConfirmVolunteer({
            volunteerName: volunteer.name.first,
            programName: program.name,
            mymast: process.env.MYMAST_URL!,
            location: location,
            commitments: commitments,
            email: program.contact.email
        })

        sendMail(
            volunteer.email,
            `You've been assigned tasks! - ${program.name}`,
            confirmationEmail
        );

        resolve();
    })

    deletion.finally(() => {
        res.writeHead(200, {
            "content-type": "text/plain"
        });
        res.end();
    })
}

export async function getUserByEmail(req: Request, res: Response) {
    if (!permissionCheck(res, PERMISSIONS.DIRECTOR)) return;

    let email = req.body.email.toLowerCase();
    let user = await AuthUser.findOne({email: email});

    if (!user) {
        res.writeHead(404);
        res.end(`User with email address "${email}" does not exist.`)
        return;
    }

    if (user.role == "volunteer") {
        let profile = await VolunteerUser.findOne({uuid: user.uuid}, {
            "admin": 0,
            "pendingAssignments": 0,
            "assignments": 0,
            "_id": 0
        });
        res.writeHead(200);
        res.end(JSON.stringify({
            role: "volunteer",
            profile: profile
        }));
    } else {
        let profile = await ParentUser.findOne({uuid: user.uuid}, {
            "_id": 0
        });
        res.writeHead(200);
        res.end(JSON.stringify({
            role: "parent",
            profile: profile
        }));
    }
}

export async function addProgramAdmin(req: Request, res: Response) {
    if (!permissionCheck(res, PERMISSIONS.DIRECTOR)) return;

    // ensure the user has correct admin permissions (3 if not already set lower)
    let user = await VolunteerUser.findOne({uuid: req.body.new_uuid});

    if (!user) {
        res.writeHead(403);
        res.end(`User "${req.body.new_uuid}" does not exist.`);
        return;
    }

    let originalAdminValue = user.admin;
    if (user.admin == 0) {
        user.admin = 3;
    };

    // update directors for the program
    let program = await Program.findOne({id: req.body.program});

    if (!program) {
        user.admin = originalAdminValue;
        user.save();
        res.writeHead(403);
        res.end(`Program "${req.body.program}" does not exist`);
        return;
    }

    program.admins.push(req.body.new_uuid);

    // update db records
    user.save();
    program.save();

    // create volunteering signup for the new director (if they aren't already signed up)
    if (program.enrollments.volunteers.indexOf(req.body.new_uuid) == -1) {
        adminProgramSignup(req.body.new_uuid, req.body.program);
    }

    res.writeHead(200, {
        "content-type": "text/plain"
    });
    res.end();
}

export async function unenrollStudent_Admin(req: Request, res: Response) {
    if (!permissionCheck(res, PERMISSIONS.ADMIN)) return;

    let unenrollPromise = unenrollStudent(req.body.enrollmentID);
    unenrollPromise.then((statusCode) => {
        res.type("text/plain");
        if (statusCode == 0) {
            res.writeHead(200);
            res.end();
        } else {
            res.writeHead(500);
            res.end();
        }
    })
}

export async function unenrollVolunteer_Admin(req: Request, res: Response) {
    if (!permissionCheck(res, PERMISSIONS.ADMIN)) return;

    let unenrollPromise = unenrollVolunteer(req.body.enrollmentID);
    unenrollPromise.then((statusCode) => {
        res.type("text/plain");
        if (statusCode == 0) {
            res.writeHead(200);
            res.end();
        } else {
            res.writeHead(500);
            res.end();
        }
    })
}

export async function toggleNewEnrollments(req: Request, res: Response) {
    if (!permissionCheck(res, PERMISSIONS.ADMIN)) return;

    const program = await Program.findOne({id: req.body.program});
    if (!program) {
        res.writeHead(404, {
            "content-type": "text/plain"
        })
        res.end(`Could not find a program with the ID of "${req.body.program}".`);
        return;
    }

    program.active[req.body.week - 1] = req.body.new_status;
    let awaitSave = program.save();

    awaitSave.finally(() => {
        res.writeHead(200, {
            "content-type": "text/plain"
        })
        res.end(req.body.new_status.toString());
    })
}

// ATTENDANCE FOR VOLUNTEERS
export async function volunteerCheckInStatus(req: Request, res: Response) {
    // volunteers cannot be checked in if they have an incomplete time record
    // find all incomplete records
    let record = await VolunteerAttendance.findOne({
        uuid: req.body.volunteer,
        endTime: -1
    });

    let queryResponse;
    if (record) {
        // volunteer has incomplete time
        if (record.program == req.body.program) {
            // volunteer has an incomplete record for the current program and can be checked out
            queryResponse= {
                action: "checkout",
                checkInTime: record.startTime
            };
        } else {
            // otherwise the volunteer has been checked in by another program (and therefore has a conflict)
            let program = await Program.findOne({id: record.program});
            if (!program) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                })
                res.end(`Volunteer user "${req.body.volunteer}" has an incomplete volunteering program for the program "${record.program}", but this program does not appear to exist. Something has likely gone VERY wrong.`)
                return;
            }

            queryResponse = {
                action: "conflict",
                conflictDetails: {
                    email: program.contact.email,
                    phone: program.contact.phone,
                    programName: program.name
                }
            }
        }
    } else {
        // volunteer has no conflicts
        queryResponse = {action: "checkin"};
    }

    res.writeHead(200, {
        "Content-Type": "application/json"
    })
    res.end(JSON.stringify(queryResponse));
}

export async function checkInVolunteer(req: Request, res: Response) {
    // volunteers cannot be checked in if they have an incomplete time record
    // find all incomplete records
    let incompleteSession = await VolunteerAttendance.findOne({
        uuid: req.body.volunteer,
        endTime: -1
    });
    if (incompleteSession) {
        res.writeHead(403, {
            "content-type": "text/plain"
        })
        res.end(`Volunteer "${req.body.volunteer}" already has an existing and incomplete volunteering session with program "${incompleteSession.program}". They must be checked out before they can check-in to a new session.`)
        return;
    }

    // error checking is done, create new attendance record
    VolunteerAttendance.create({
        program: validateData(req.body.program, res),
        uuid: validateData(req.body.volunteer, res),
        date: {
            date: validateData(req.body.date.date, res),
            month: validateData(req.body.date.month, res),
            year: validateData(req.body.date.year, res)
        },
        startTime: validateData(req.body.startTime, res)
    }).then(() => {
        res.writeHead(200, {
            "content-type": "text/plain"
        })
        res.end();
    })
}

function roundTimeInteger(int: number) {
    return Math.round(int * 100) / 100;
}

export async function checkOutVolunteer(req: Request, res: Response) {
    const volunteer: VolunteersDocument = res.locals.volunteer;
    const program: ProgramsDocument = res.locals.program;

    // find the incomplete attendance record
    let record = await VolunteerAttendance.findOne({
        program: validateData(req.body.program, res),
        uuid: validateData(req.body.volunteer, res),
        endTime: -1
    })

    // ensure an incomplete record/session exists
    if (!record) {
        res.writeHead(403, {
            "content-type": "text/plain"
        })
        res.end(`Could not find an incomplete volunteering session for the program "${req.body.program}" for the volunteer "${req.body.volunteer}".`)
        return;
    }

    // ensure the end time is after the start time
    if (record.startTime >= req.body.endTime) {
        res.writeHead(400, {
            "content-type": "text/plain"
        })
        res.end("Session start time is later than or equal to the provided end time.");
        return;
    }

    // complete the attendance record
    record.endTime = validateData(req.body.endTime, res);
    record.note = req.body.note;
    let hours = roundTimeInteger(record.endTime - record.startTime);
    record.hours = hours;

    // update overall volunteer hours
    let saveRecord = record.save();
    for (var commitment of volunteer.assignments) {
        if (commitment.program == req.body.program) {
            commitment.hours = roundTimeInteger(commitment.hours + hours);
        }
    }

    Promise.all([saveRecord, volunteer.save()]).then(() => {
        res.writeHead(200, {
            "content-type": "text/plain"
        })
        res.end();
    })
}

export async function addVolunteerHours(req: Request, res: Response) {
    const volunteer: VolunteersDocument = res.locals.volunteer;
    const program: ProgramsDocument = res.locals.program;

    // calculate hours, ensure they are not negative
    let recordHours = roundTimeInteger(validateData(req.body.endTime, res) - validateData(req.body.startTime, res));
    if (recordHours <= 0) {
        res.writeHead(400, {
            "content-type": "text/plain"
        });
        res.end("The end time must be greater than the start time.");
        return;
    }

    let date = {
        month: validateData(req.body.date.month, res),
        date: validateData(req.body.date.date, res),
        year: validateData(req.body.date.year, res),
    }

    // make sure hours do not already exist in this range
    let conflictingHours = await VolunteerAttendance.find({
        uuid: req.body.volunteer,
        program: req.body.program,
        "date.month": req.body.date.month,
        "date.date": req.body.date.date,
        "date.year": req.body.date.year,
        $or: [
            {$and: [
                { startTime: { $gte: req.body.startTime } },
                { endTime: { $lte: req.body.endTime } }
            ]},
            {$and: [
                { startTime: { $lte: req.body.startTime } },
                { endTime: { $gte: req.body.endTime } }
            ]},
        ]
    })
    if (conflictingHours.length > 0) {
        res.writeHead(409, {
            "content-type": "text/plain"
        })
        res.end(`Volunteer "${req.body.volunteer}" already has volunteering hours for the program "${req.body.program}" during this date and time range.`)
        return;
    }

    let createRecord = VolunteerAttendance.create({
        uuid: req.body.volunteer,
        program: req.body.program,
        date: date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        hours: recordHours,
        note: req.body.note
    })

    for (var commitment of volunteer.assignments) {
        if (commitment.program == req.body.program) {
            commitment.hours = roundTimeInteger(commitment.hours + recordHours);
        }
    }

    Promise.all([createRecord, volunteer.save()]).then(() => {
        res.writeHead(200, {
            "content-type": "text/plain"
        });
        res.end();
    })
}

export async function viewVolunteerHours(req: Request, res: Response) {
    let records = await VolunteerAttendance.find({
        uuid: req.body.volunteer,
        program: req.body.program
    }, {
        "date": 1,
        "startTime": 1,
        "endTime": 1,
        "hours": 1,
        "note": 1,
        "_id": 0
    }).sort({
        "date.year": "asc",
        "date.month": "asc",
        "date.date": "asc"
    })

    res.writeHead(200, {
        "content-type": "application/json"
    })
    if (!records) {
        res.end(JSON.stringify([{}]));
    } else {
        res.end(JSON.stringify(records));
    }
}

export async function deleteVolunteeringSession(req: Request, res: Response) {
    const volunteer: VolunteersDocument = res.locals.volunteer;
    const program: ProgramsDocument = res.locals.program;

    let deleteRecord = await VolunteerAttendance.findOne({
        "date.month": validateData(req.body.record.date.month, res),
        "date.year": validateData(req.body.record.date.year, res),
        "date.date": validateData(req.body.record.date.date, res),
        startTime: validateData(req.body.record.startTime, res),
        endTime: validateData(req.body.record.endTime, res),
        program: req.body.program,
        uuid: req.body.volunteer
    })

    if (!deleteRecord) {
        res.writeHead(404, {
            "content-type": "text/plain"
        })
        res.end(`Could not find any records for volunteer "${req.body.volunteer}" for the program "${req.body.program}" that matched the provided criteria: ${JSON.stringify(req.body.record)}`);
        return;
    }

    for (var commitment of volunteer.assignments) {
        if (commitment.program == program.id) {
            commitment.hours = roundTimeInteger(commitment.hours - deleteRecord.hours)
        }
    }

    Promise.all([volunteer.save(), deleteRecord.deleteOne()]).then(() => {
        res.writeHead(200, {
            "content-type": "text/plain"
        })
        res.end();
    })
}

export async function editVolunteeringSession(req: Request, res: Response) {
    const volunteer: VolunteersDocument = res.locals.volunteer;
    // find the record to update and error if it doesn't exist
    let existingRecord = await VolunteerAttendance.findOne({
        uuid: req.body.volunteer,
        program: req.body.program,
        "date.month": validateData(req.body.original.date.month, res),
        "date.year": validateData(req.body.original.date.year, res),
        "date.date": validateData(req.body.original.date.date, res),
        startTime: validateData(req.body.original.startTime, res),
        endTime: validateData(req.body.original.endTime, res),
    })

    if (!existingRecord) {
        res.writeHead(404, {
            "content-type": "text/plain"
        });
        res.end(`The record "${JSON.stringify(req.body.original)}" was not found for the volunteer "${req.body.volunteer}" for the program "${req.body.program}".`)
        return;
    }

    // ensure no conflicting records with the new record
    if (!validateData(req.body.new.startTime, res) || !validateData(req.body.new.endTime, res)) return;
    let conflictingRecord = await VolunteerAttendance.findOne({
        uuid: req.body.volunteer,
        program: req.body.program,
        "date.month": validateData(req.body.new.date.month, res),
        "date.year": validateData(req.body.new.date.year, res),
        "date.date": validateData(req.body.new.date.date, res),
        $or: [
            {$and: [
                { startTime: { $gte: req.body.new.startTime } },
                { endTime: { $lte: req.body.new.endTime } }
            ]},
            {$and: [
                { startTime: { $lte: req.body.new.startTime } },
                { endTime: { $gte: req.body.new.endTime } }
            ]},
        ]
    })

    if (conflictingRecord && conflictingRecord._id.toString() != existingRecord._id.toString()) {
        res.writeHead(409, {
            "content-type": "text/plain"
        })
        res.end(`Volunteer "${req.body.volunteer}" already has volunteering hours for the program "${req.body.program}" during this date and time range.`)
        return;
    }

    // update the record
    existingRecord.date = req.body.new.date;
    existingRecord.startTime = req.body.new.startTime;
    existingRecord.endTime = req.body.new.endTime;
    existingRecord.note = req.body.new.note;

    // update hours
    let originalHours = existingRecord.hours;
    let recordHours = roundTimeInteger(req.body.new.endTime - req.body.new.startTime);
    if (recordHours <= 0) {
        res.writeHead(400, {
            "content-type": "text/plain"
        });
        res.end("The end time must be greater than the start time.");
        return;
    }

    existingRecord.hours = recordHours;

    for (var commitment of volunteer.assignments) {
        if (commitment.program == req.body.program) {
            commitment.hours = roundTimeInteger(commitment.hours - originalHours + recordHours);
        }
    }

    Promise.all([existingRecord.save(), volunteer.save()]).then(() => {
        res.writeHead(200, {
            "content-type": "text/plain"
        })
        res.end();
    })
}

// ATTENDANCE FOR STUDENTS
export async function checkStudentAttendanceStatus(req: Request, res: Response) {
    const student: StudentsDocument = res.locals.student;
    const program: ProgramsDocument = res.locals.program;

    if (!req.body.week || req.body.week <= 0 || req.body.week > program.schedule.length) {
        res.writeHead(400, {
            "content-type": "text/plain"
        })
        res.end(`Value "${req.body.week}}" is not valid for the property week.`);
        return;
    };
    let programSchedule = program.schedule.toObject() as any[][];
    let schedule = programSchedule[req.body.week - 1];
    
    let scheduleQuery = schedule.map(day => {
        return {
            "date.month": day.month,
            "date.year": day.year,
            "date.date": day.date
        }
    })
    
    let records = await StudentAttendance.find({
        uuid: req.body.student,
        program: req.body.program,
        $or: scheduleQuery
    })
    
    let status: boolean[] = [];
    if (records.length == 0) {
        for (let day of schedule) {
            status.push(false);
        }
    } else {
        for (let day = 0; day < schedule.length; day++) {
            for (var record of records) {
                if (
                    schedule[day].date == record.date.date &&
                    schedule[day].month == record.date.month &&
                    schedule[day].year == record.date.year
                ) {
                    status[day] = true;
                    break;
                } else status[day] = false;
            }
        }
    }

    res.writeHead(200, {
        "content-type": "application/json"
    })
    res.end(JSON.stringify(status));
}

export async function toggleStudentAttendance(req: Request, res: Response) {
    const student: StudentsDocument = res.locals.student;
    const program: ProgramsDocument = res.locals.program;

    if (
        !validateData(req.body.date.date, res) ||
        !validateData(req.body.date.month, res) ||
        !validateData(req.body.date.year, res)
    ) {
        res.writeHead(400, {
            "content-type": "text/plain"
        })
        res.end(`Date "${JSON.stringify(req.body.date)}" is missing one of the following properties: date, month, year.`);
        return;
    }

    // ensure requested date exists in the program
    let programSchedule = program.schedule.toObject() as any[][];
    let dateExists = false;
    for (let week of programSchedule) {
        for (let day of week) {
            if (
                day.month == req.body.date.month &&
                day.date == req.body.date.date &&
                day.year == req.body.date.year
            ) {
                dateExists = true;
                break;
            }
        }
        if (dateExists) break;
    }
    if (!dateExists) {
        res.writeHead(404, {
            "content-type": "text/plain"
        })
        res.end(`Date "${JSON.stringify(req.body.date)}" does not exist in the schedule for program "${req.body.program}"`);
        return;
    }

    // see if the attendance record exists (in which case delete it)
    let doc = {
        program: req.body.program,
        uuid: req.body.student,
        "date.date": req.body.date.date,
        "date.month": req.body.date.month,
        "date.year": req.body.date.year
    }
    let existingRecord = await StudentAttendance.findOne(doc)
    res.writeHead(200, {
        "content-type": "application/json"
    })
    if (existingRecord && !req.body.present) {
        await existingRecord.deleteOne();
        res.end(JSON.stringify({status: false}));
    } else if (existingRecord && req.body.present) {
        res.end(JSON.stringify({status: true}));
    } else if (!existingRecord && !req.body.present) {
        res.end(JSON.stringify({status: false}));
    } else {
        await StudentAttendance.create(doc);
        res.end(JSON.stringify({status: true}));
    }
}
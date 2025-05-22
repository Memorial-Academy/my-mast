import { Request, Response } from "express";
import ParentUser from "../models/users/parent.model";
import VolunteerUser from "../models/users/volunteer.model";
import StudentUser from "../models/users/student.model";
import VolunteerSignup from "../models/application/volunteer_signups.model";
import { randomBytes } from "crypto";
import Program from "../models/application/program.model";
import { Templates } from "../scripts/pug_handler";
import { sendMail } from "../scripts/mailer";
import { unenrollStudent } from "../scripts/unenroll";
import AuthUser from "../models/auth/user.model";
import { validateEmail } from "../scripts/input_validation";

function checkRole(correctRole: "volunteer" | "parent", req: Request, res: Response) {
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
                    "school": 1,
                    "skills": 1,
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
                    "emergencyContact": 1,
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

export function generateEnrollmentID(uuid: string) {
    return `${uuid}_e:${randomBytes(10).toString("hex")}`;
}

export async function newEnrollment(req: Request, res: Response) {  // for students and parents
    const enrollmentData = req.body.data;
    let program = await Program.findOne({id: req.body.program});

    if (!program) {
        res.writeHead(404);
        res.end("No program found");
        return;
    }

    // get location information; this is used in the confirmation emails
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
    
    if (req.params.role == "parent") {  
        // Create new enrollments for students (via a parent account)
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

            let emailThread = new Promise<void>(resolve => {
                let course = program.courses[enrollment.class];

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
                    parent: parent!.name.first,
                    student: {
                        first: student.name.first,
                        last: student.name.last
                    },
                    program: program.name,
                    course: course.name,
                    location: location,
                    session: sessionStr,
                    // email: program.program_type == "stempark" ? "stempark@memorialacademy.org" : "letscode@memorialacademy.org",
                    email: program.contact.email,
                    mymast: process.env.MYMAST_URL!
                })

                sendMail(
                    parent!.email,
                    `Enrollment Confirmation - ${student.name.first} ${student.name.last} - ${program.name}`,
                    confirmationEmail
                )

                resolve();
            })
        }
    } else if (req.params.role == "volunteer") { 
        // Create new enrollment for volunteers
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

        if (volunteer.pendingAssignments) {
            volunteer.pendingAssignments.push(enrollmentID);
        } else {
            volunteer.pendingAssignments = [enrollmentID];
        }
        volunteer.save();
        
        program.enrollments.volunteers.push(enrollmentID);

        let emailThread = new Promise<void>(resolve => {
            let coursesStr = "";
            let weeksStr = enrollmentData.weeks.length > 1 ? "weeks " : "week ";

            if (enrollmentData.courses.length > 1) {
                for (var i = 0; i < enrollmentData.courses.length; i++) {
                    if (enrollmentData.courses.length - 1 == i) {
                        coursesStr += `and ${program.courses[enrollmentData.courses[i]].name}`;
                    } else if (enrollmentData.courses.length - 2 == i) {
                        coursesStr += `${program.courses[enrollmentData.courses[i]].name} `;
                    } else {
                        coursesStr += `${program.courses[enrollmentData.courses[i]].name}, `;
                    }
                }
            } else {
                coursesStr = program.courses[enrollmentData.courses[0]].name;
            }

            if (enrollmentData.weeks.length > 1) {
                for (var i = 0; i < enrollmentData.weeks.length; i++) {
                    console.log(enrollmentData.weeks[i])
                    if (enrollmentData.weeks.length - 1 == i) {
                        weeksStr += `and ${enrollmentData.weeks[i]}`;
                    } else if (enrollmentData.weeks.length - 2 == i) {
                        weeksStr += `${enrollmentData.weeks[i]} `;
                    } else {
                        weeksStr += `${enrollmentData.weeks[i]}, `;
                    }
                }
            } else {
                weeksStr += enrollmentData.weeks[0];
            }

            let confirmationEmail = Templates.VolunteerSignup({
                volunteer: volunteer.name,
                program: program.name,
                courses: coursesStr,
                weeks: weeksStr,
                email: program.contact.email,
                instructor: enrollmentData.instructor,
                location: location,
                pending_notice: program.courses.length > 1,
                mymast: process.env.MYMAST_URL!
            })

            sendMail(
                volunteer.email,
                `Volunteer Signup Confirmation - ${program.name}`,
                confirmationEmail
            )

            resolve();
        })
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

export async function addstudent(req: Request, res: Response) {
    if (!checkRole("parent", req, res)) return;
    
    let parent = await ParentUser.findOne({uuid: req.body.uuid});

    if (!parent) {
        res.type("text/plain");
        res.writeHead(404);
        res.end(`Could not find parent with UUID "${req.body.uuid}".`)
        return;
    }

    let studentUUID = "s_" + randomBytes(32).toString("hex");
    let birthday = req.body.student_birthday.split("-");    // formatted as YYYY-MM-DD

    let createPromise = StudentUser.create({
        name: {
            first: req.body.student_first_name,
            last: req.body.student_last_name
        },
        uuid: studentUUID,
        birthday: {
            day: birthday[2],
            month: birthday[1],
            year: birthday[0]
        },
        notes: req.body.notes || "",
        linkedParent: parent.uuid
    })

    parent.linkedStudents.push(studentUUID);
    parent.save();

    createPromise.then(() => {
        res.type("text/plain");
        res.writeHead(200);
        res.end();
    })
}

export async function deleteStudent(req: Request, res: Response) {
    if (!checkRole("parent", req, res)) return;
    res.type("text/plain");

    let student = await StudentUser.findOne({uuid: req.body.student});
    let parent = await ParentUser.findOne({uuid: req.body.uuid});
    
    if (!student) {     // check if student exists
        res.writeHead(404);
        res.end(`Student "${req.body.student}" does not exist`);
        return;
    } else if (student.linkedParent != req.body.uuid) {     // check if student is linked to the parent requesting deletion
        res.writeHead(403);
        res.end("Unauthorized");
        return;
    } else if (!parent) {
        res.writeHead(404);
        res.end(`Parent "${req.body.uuid}" does not exist`);
        return;
    }

    // unenroll student from all programs
    for (var enrollment of student.enrollments) {
        unenrollStudent(enrollment.id);
    }

    // remove student from parent account
    let studentIndex = parent.linkedStudents.indexOf(req.body.student);
    parent.linkedStudents.splice(studentIndex, 1);
    parent.save();

    // delete student record
    console.log("deleting student");
    let awaitDelete = student.deleteOne();

    awaitDelete.then(() => {
        res.type("text/plain");
        res.writeHead(200);
        res.end();
    })
}

export async function checkConflicts(req: Request, res: Response) {
    const program = await Program.findOne({id: req.body.program});
    if (!program) {
        res.type("text/plain");
        res.writeHead(404);
        res.end(`Program "${req.body.program}" does not exist.`);
        return;
    }

    // schedule from DB record in a conventional JSON array form
    let schedule = program.schedule.map(week => {
        let weekArr = Array.from(Object.values(week.toObject()));
        weekArr = weekArr.map((day: any) => {
            delete day["_id"];
            delete day["dayCount"];
            day.start = { $gte: day.start };
            day.end = { $lte: day.end };
            return day;
        })
        return weekArr;
    });

    if (req.params.role == "parent") {
        // CONFLICTS FOR STUDENTS (enrolled via parent account)
        for (var enrollment of req.body.enrollments) {
            // calculate start and end weeks for the requested enrolled and determine what dates to query the database with
            let startWeek = enrollment.week - 1;
            let endWeek = program.courses[enrollment.course].duration + startWeek - 1;
            let querySchedule = new Array();
            let requestWeeks = new Array<number>();

            for (var weekIndex = startWeek; weekIndex <= endWeek; weekIndex++) {
                requestWeeks.push(weekIndex + 1);
                querySchedule = querySchedule.concat(schedule[weekIndex]);
            }
            
            let enrolledPrograms = await Program.find({
                $and: [
                    { "enrollments.students": { $regex: new RegExp(enrollment.student) } },
                    { schedule: {$elemMatch: {$elemMatch: {$or: querySchedule} }}}
                ]
            });

            // if no document(s) are found then there is no possibility of conflicts
            if (enrolledPrograms.length === 0) {
                res.writeHead(200, {
                    "content-type": "application/json"
                });
                res.end(JSON.stringify({
                    conflicts: false
                }));
                return;
            }

            // otherwise check to see if there are any enrollments that match the specific week(s) of the requested enrollment
            for (var enrolledProgram of enrolledPrograms) {
                let student = await StudentUser.findOne({ $and: [
                    { uuid: enrollment.student },
                    { enrollments: { $elemMatch: {
                        program: enrolledProgram.id,
                        week: { $in: requestWeeks }
                    }}}
                ]})
                if (student) {
                    res.writeHead(200, {
                        "content-type": "application/json"
                    })
                    res.end(JSON.stringify({
                        conflicts: true,
                        student: student.uuid
                    }));
                    return;
                }
            }
        }
    } else if (req.params.role == "volunteer") {
        // CONFLICTS FOR VOLUNTEERS
        let signupWeeks = (req.body.weeks as number[]).sort();

        // build the query schedule
        let querySchedule = new Array();
        for (var week of signupWeeks) {
            querySchedule = querySchedule.concat(schedule[week - 1]);
        }

        // find all programs the user is enrolled in that have a matching schedule
        let enrolledPrograms = await Program.find({
            $and: [
                { "enrollments.volunteers": { $regex: new RegExp(req.body.uuid) } },
                { schedule: {$elemMatch: {$elemMatch: {$or: querySchedule} }}}
            ]
        })

        // if no document(s) are found then there is no possibility of conflicts
        if (enrolledPrograms.length === 0) {
            res.writeHead(200, {
                "content-type": "application/json"
            });
            res.end(JSON.stringify({
                conflicts: false
            }));
            return;
        }

        // otherwise check to see if there are any enrollments that match the specific week(s) of the requested enrollment
        for (var enrolledProgram of enrolledPrograms) {
            let volunteer = await VolunteerUser.findOne({ $and: [
                { uuid: req.body.uuid },
                { assignments: { $elemMatch: {
                    program: enrolledProgram.id,
                    commitments: { $elemMatch: {
                        week: {$in: signupWeeks}
                    }}
                }}}
            ]})

            let pendingVolunteer = await VolunteerSignup.findOne({ $and: [
                {uuid: req.body.uuid},
                {program: enrolledProgram.id},
                {weeks: {$in: signupWeeks}}
            ]})

            if (volunteer || pendingVolunteer) {
                res.writeHead(200, {
                    "content-type": "application/json"
                })
                res.end(JSON.stringify({
                    conflicts: true
                }));
                return;
            }
        }
    } else {
        // exits if invalid account type
        res.type("text/plain");
        res.writeHead(403);
        res.end("Invalid role");
        return;
    }
    res.writeHead(200, {
        "content-type": "application/json"
    })
    res.end(JSON.stringify({
        conflicts: false
    }));
}

export async function updateProfile(req: Request, res: Response) {    
    let user;
    if (req.params.role == "parent") {
        user = await ParentUser.findOne({uuid: req.body.uuid});
        if (!user) {
            res.writeHead(404, {
                "Content-Type": "text/plain"
            });
            res.end(`User "${req.body.uuid}" does not exist.`);
            return;
        }
        
        if (req.body.emergencyContact) {
            let originalEmergencyContact = user.emergencyContact;
            user.emergencyContact.name.first = req.body.emergencyContact.name.first || originalEmergencyContact.name.first;
            user.emergencyContact.name.last = req.body.emergencyContact.name.last || originalEmergencyContact.name.last;
            user.emergencyContact.email = req.body.emergencyContact.email || originalEmergencyContact.email;
            user.emergencyContact.phone = req.body.emergencyContact.phone || originalEmergencyContact.phone;
        }
    } else if (req.params.role == "volunteer") {
        user = await VolunteerUser.findOne({uuid: req.body.uuid});
        if (!user) {
            res.writeHead(404, {
                "Content-Type": "text/plain"
            });
            res.end(`User "${req.body.uuid}" does not exist.`);
            return;
        }

        user.school = req.body.school || user.school;
        user.skills = req.body.skills || user.skills;
    } else {
        res.writeHead(404, {
            "Content-Type": "text/plain"
        })
        res.end(`"${req.params.role}" is not a valid role.`)
        return;
    }

    // save general data
    user.name.first = req.body.name.first || user.name.first;
    user.name.last = req.body.name.last || user.name.last;
    user.phone = req.body.phone || user.phone;
    
    // update email address
    let newEmail = req.body.email.toLowerCase()
    if (user.email != newEmail && newEmail != "" && validateEmail(newEmail)) {
        user.email = newEmail;

        // update email on auth
        let authUser = await AuthUser.findOne({uuid: req.body.uuid});
        if (!authUser) {
            res.writeHead(500, {
                "content-type": "text/plain"
            });
            res.end(`Could not find the authentication record for the user with UUID "${req.body.uuid}". Something has gone VERY wrong.`)
            return
        }

        authUser.email = newEmail;
        authUser.save();
    }
    await user.save();

    res.type("text/plain");
    res.writeHead(200)
    res.end();
}

export async function updateStudents(req: Request, res: Response) {
    if (!checkRole("parent", req, res)) return;

    for (var studentInfo of req.body.students) {
        let student = await StudentUser.findOne({uuid: studentInfo.uuid});

        // check if student exists or not
        if (!student) {
            res.writeHead(404, {
                "content-type": "text/plain"
            })
            res.end(`Student user "${studentInfo.uuid}" cannot be found.`)
            return;
        }

        // check if parent is authorized to modify student profile
        if (student.linkedParent != req.body.uuid) {
            res.writeHead(403, {
                "content-type": "text/plain"
            })
            res.end(`Student user "${studentInfo.uuid}" is not linked to parent user "${req.body.uuid}".`)
            return;
        }

        // edit student profile
        if (studentInfo.name) {
            student.name.first = studentInfo.name.first || student.name.first;
            student.name.last = studentInfo.name.last || student.name.last;
        }
        student.notes = studentInfo.notes;
        let birthday = studentInfo.birthday.split("-");
        student.birthday = {
            day: parseInt(birthday[2]) || student.birthday.day,
            month: parseInt(birthday[1]) || student.birthday.month,
            year: parseInt(birthday[0]) || student.birthday.year
        }

        await student.save();
    }
    res.writeHead(200, {
        "content-type": "text/plain"
    })
    res.end();
}
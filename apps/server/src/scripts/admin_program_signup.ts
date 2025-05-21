import Program from "../models/application/program.model";
import VolunteerSignup from "../models/application/volunteer_signups.model";
import VolunteerUser from "../models/users/volunteer.model";
import { generateEnrollmentID } from "../controllers/user.controller";

export default async function adminProgramSignup(uuid: string, programID: string) {
    let program = (await Program.findOne({id: programID}))!;
    let user = (await VolunteerUser.findOne({uuid: uuid}))!;

    // prevent duplicate signups if volunteer signed up before being made an admin
    if (program.enrollments.volunteers.find(val => val.indexOf(uuid) > -1)) {
        return;
    }

    let courses = program.courses.map((course, index) => {
        return course.id;
    })

    let weeks = program.schedule.map((week, index) => {
        return index + 1;
    })

    let enrollmentID = generateEnrollmentID(uuid);
    program.enrollments.volunteers.push(enrollmentID);

    VolunteerSignup.create({
        uuid: uuid,
        program: programID,
        courses: courses,
        weeks: weeks,
        instructorInterest: true,
        id: enrollmentID
    })

    if (user.pendingAssignments) {
        user.pendingAssignments.push(enrollmentID);
    } else {
        user.pendingAssignments = [enrollmentID];
    }

    user.save();
    program.save();
}
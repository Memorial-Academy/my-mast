import Program from "../models/application/program.model";
import VolunteerSignup from "../models/application/volunteer_signups.model";
import StudentUser from "../models/users/student.model";
import VolunteerUser from "../models/users/volunteer.model";

// returns 1 on error
// returns 0 on success
export async function unenrollStudent(enrollmentID: string) {
    const program = await Program.findOne({"enrollments.students": enrollmentID});
    if (!program) return 1;
    
    const student = await StudentUser.findOne({enrollments: { $elemMatch: {
        id: enrollmentID
    }}});
    if (!student) return 1;

    // remove enrollment from program document
    let enrollmentIndex = program.enrollments.students.indexOf(enrollmentID);
    program.enrollments.students.splice(enrollmentIndex, 1);
    await program.save();

    // remove enrollment from student document
    for (var i = 0; i < student.enrollments.length; i++) {
        if (student.enrollments[i].id === enrollmentID) {
            student.enrollments.splice(i, 1);
            await student.save();
            break;
        }
    }
    return 0;
}

export async function unenrollVolunteer(enrollmentID: string) {
    const program = await Program.findOne({"enrollments.volunteers": enrollmentID});
    if (!program) return 1;

    // get volunteer
    const volunteer = await VolunteerUser.findOne({$or: [
        { assignments: { $elemMatch: {
            id: enrollmentID
        }}},
        { pendingAssignments: enrollmentID }
    ]})
    if (!volunteer) return 1;

    // remove signup from program DB document
    let programSignupIndex = program.enrollments.volunteers.indexOf(enrollmentID);
    program.enrollments.volunteers.splice(programSignupIndex, 1);
    await program.save();

    // determine if the signup is pending or confirmed
    if (volunteer.pendingAssignments.indexOf(enrollmentID) > -1) {
        // the signup is pending
        // remove the pending signup record
        await VolunteerSignup.deleteOne({id: enrollmentID});

        // remove the signup from the volunteer
        let signupIndex = volunteer.pendingAssignments.indexOf(enrollmentID);
        volunteer.pendingAssignments.splice(signupIndex, 1);
    } else {
        // the signup is confirmed (not pending)
        // delete the confirmed commitment
        for (var i = 0; i < volunteer.assignments.length; i++) {
            if (volunteer.assignments[i].id === enrollmentID) {
                volunteer.assignments.splice(i, 1);
                break;
            }
        }
    };
    await volunteer.save();
    return 0;
}
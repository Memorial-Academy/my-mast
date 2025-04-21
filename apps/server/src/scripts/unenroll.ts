import Program from "../models/application/program.model";
import StudentUser from "../models/users/student.model";

// returns 1 on error
// returns 0 on success
export async function unenrollStudent(enrollmentID: string) {
    const program = await Program.findOne({enrollments: {students: enrollmentID}});
    if (!program) return 1;
    
    const student = await StudentUser.findOne({enrollments: { $elemMatch: {
        id: enrollmentID
    }}});
    if (!student) return 1;

    // remove enrollment from program document
    let enrollmentIndex = program.enrollments.students.indexOf(enrollmentID);
    program.enrollments.students.splice(enrollmentIndex, 1);
    program.save();

    // remove enrollment from student document
    for (var i = 0; i < student.enrollments.length; i++) {
        if (student.enrollments[i].id == enrollmentID) {
            student.enrollments.splice(i, 1);
            student.save();
            break;
        }
    }
    return 0;
}
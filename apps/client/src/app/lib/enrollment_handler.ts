"use server";
import API from "./APIHandler";
import sessionInfo from "@mymast/utils/authorize_session";

// Handlers for parent enrolling a student
// initial verification of enrollment data
export async function studentEnrollment(data: FormData, program: string) {
    const auth = (await sessionInfo())!;
    let enrollmentInformation: Array<StudentEnrollmentInformation> = [];
    const students = data.getAll("enroll_students");

    let conflictCheckData: Array<{
        student: string,
        week: number
    }> = []

    for (var student of students) {
        enrollmentInformation.push({
            id: student.toString(),
            class: parseInt(data.get(`${student}_class`)!.toString()),
            week: parseInt(data.get(`${student}_week`)!.toString())
        })
    }

    let conflicts = await API.User.checkStudentConflicts(
        auth.uuid,
        auth.token,
        program,
        enrollmentInformation.map(enrollment => {
            return {
                student: enrollment.id,
                week: enrollment.week,
                course: enrollment.class
            }
        })
    )
    if (conflicts.conflicts) {
        return {
            conflicts: true,
            student: conflicts.student
        }
    } else {
        return {
            conflicts: false,
            enrollmentInformation
        }
    }
}

// submit enrollment to the database
export async function submitStudentEnrollment(data: Array<StudentEnrollmentInformation>, program_id: string) {
    const auth = (await sessionInfo())!;

    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/parent/newenrollment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uuid: auth.uuid,
            token: auth.token,
            data: data,
            program: program_id
        })
    })
    if (!req.ok) {
        return await req.text();
    }
}


// Handlers for a volunteer signing up
// initial verification of enrollment information
export async function volunteerSignup(data: FormData) {
    let courseInterest = data.getAll("course_interest").map(val => {
        return parseInt(val.toString());
    })
    
    let weeks = data.getAll("weeks").map(val => {
        return parseInt(val.toString());
    })
    
    return {
        weeks: weeks || [0],
        courses: courseInterest || [0],
        instructor: data.get("instructor")!.toString() == "yes" ? true : false
    }
}

// submit volunteer signup
export async function submitVolunteerSignup(data: VolunteerSignupInformation, program_id: string) {
    const auth = (await sessionInfo())!;
    
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/volunteer/newenrollment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uuid: auth.uuid,
            token: auth.token,
            data: data,
            program: program_id
        })
    })
    if (!req.ok) {
        return await req.text();
    }
}
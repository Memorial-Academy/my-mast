"use server";
import authorizeSession from "@mymast/utils/authorize_session";

// Handlers for parent enrolling a student
// initial verification of enrollment data
export async function studentEnrollment(data: FormData) {
    let enrollmentInformation: Array<StudentEnrollmentInformation> = [];
    const students = data.getAll("enroll_students")

    for (var student of students) {
        enrollmentInformation.push({
            id: student.toString(),
            class: parseInt(data.get(`${student}_class`)!.toString()),
            week: parseInt(data.get(`${student}_week`)!.toString())
        })
    }

    return enrollmentInformation;
}

// submit enrollment to the database
export async function submitStudentEnrollment(data: Array<StudentEnrollmentInformation>, program_id: string) {
    const auth = (await authorizeSession())!;

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
    const auth = (await authorizeSession())!;
    
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
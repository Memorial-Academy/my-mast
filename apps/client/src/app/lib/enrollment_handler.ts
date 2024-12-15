"use server";
import { cookies } from "next/headers";

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


export async function submitStudentEnrollment(data: Array<StudentEnrollmentInformation>, program_id: string) {
    const auth = JSON.parse(cookies().get("id")!.value);

    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/parent/newenrollment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uuid: auth[1],
            token: auth[0],
            data: data,
            program: program_id
        })
    })
    if (!req.ok) {
        return await req.text();
    }
}
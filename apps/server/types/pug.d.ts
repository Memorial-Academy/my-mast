type PasswordResetLocals = {
    user: string,
    email: string,
    link: string
}

type StudentEnrollmentLocals = {
    parent: string,
    student: {
        first: string,
        last: string
    },
    program: string,
    session: string,
    course: string,
    location: {
        name?: string,
        type: "virtual" | "physical",
        address?: string
    },
    email: string   // contact email
}

type VolunteerEnrollmentLocals = {
    volunteer: {
        first: string,
        last: string
    },
    program: string,
    courses: string,
    weeks: string,
    instructor: boolean,
    pending_notice: boolean,
    location: {
        name?: string,
        type: "virtual" | "physical",
        address?: string
    }
}

// Compile templates to html
type CompilableTemplate = (locals: any) => string;
type PasswordResetTemplate = ((locals: PasswordResetLocals) => string);
type StudentEnrollmentTemplate = ((locals: StudentEnrollmentLocals) => string);
type VolunteerEnrollmentTemplate = ((locals: VolunteerEnrollmentLocals) => string);
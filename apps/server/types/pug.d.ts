// generic helper types
type EmailLocation = {
    name?: string,
    type: "virtual" | "physical",
    address?: string,
    link?: string
}

// template specific types
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
    location: EmailLocation,
    email: string,  // contact email
    mymast: string
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
    location: EmailLocation,
    email: string,  // contact email
    mymast: string
}

type ConfirmVolunteerLocals = {
    volunteerName: string,
    programName: string,
    commitments: {
        courseName: string
        week: number,
        startDate: string,
        endDate: string,
        instructor: boolean
    }[],
    location: EmailLocation,
    mymast: string,
    email: string
}

// Compile templates to html
type CompilableTemplate = (locals: any) => string;
type PasswordResetTemplate = ((locals: PasswordResetLocals) => string);
type StudentEnrollmentTemplate = ((locals: StudentEnrollmentLocals) => string);
type VolunteerEnrollmentTemplate = ((locals: VolunteerEnrollmentLocals) => string);
type ConfirmVolunteerTemplate = ((locals: ConfirmVolunteerLocals) => string);
import { join } from "path";
import { compileFile } from "pug";

const templateDir = join(__dirname, "../../templates");

export const Templates = {
    PasswordReset: compileFile(join(templateDir, "password_reset.pug")) as PasswordResetTemplate,
    StudentEnrollment: compileFile(join(templateDir, "student_enrollment.pug")) as StudentEnrollmentTemplate,
    VolunteerSignup: compileFile(join(templateDir, "volunteer_signup.pug")) as VolunteerEnrollmentTemplate,
    ConfirmVolunteer: compileFile(join(templateDir, "confirm_volunteer.pug")) as ConfirmVolunteerTemplate
}
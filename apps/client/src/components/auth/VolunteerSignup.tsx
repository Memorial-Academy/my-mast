import { LabelledInput } from "@mymast/ui";

export default function VolunteerSignupPage() {
    return (
        <>
            <input readOnly className="signup-role-tracker" value="volunteer" title="role" name="role" />

            <h2>Volunteer Information</h2>
            <LabelledInput 
                question="School of Attendance"
                placeholder="School"
                required
                name="school"
            />
            <LabelledInput 
                question="Date of Birth"
                type="date"
                required
                name="birthday"
            />
            <LabelledInput 
                question="Do you have any special interest, experiences, etc. that you want us to know about? List them here!"
                type="text"
                name="skills"
                placeholder="Brag about yourself here"
            />
        </>
    )
}
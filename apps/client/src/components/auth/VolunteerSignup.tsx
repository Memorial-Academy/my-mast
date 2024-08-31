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
                question="Birthday"
                type="date"
                required
                name="birthday"
            />
        </>
    )
}
import LabelledInput from "@/components/LabelledInputs";

export default function VolunteerSignupPage() {
    return (
        <>
            <input className="signup-role-tracker" value="volunteer" name="role" />

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
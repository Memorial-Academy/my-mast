import LabelledInput from "@/components/LabelledInputs";

export default function ParentSignupPage() {
    return (
        <>
            <input className="signup-role-tracker" value="parent" name="role" />

            <h2>Parent Information</h2>
            <LabelledInput
                question="First Name"
                placeholder="First name"
                required
                name="first_name"
            />
            <LabelledInput
                question="Last Name"
                placeholder="Last name"
                required
                name="last_name"
            />
            <LabelledInput
                question="Phone Number"
                placeholder="Phone number"
                required
                name="phone_number"
            />
            <p>Almost done! After you click "Create Account," you'll be redirected to your dashboard, where you can enter information for your students.</p>
        </>
    )
}
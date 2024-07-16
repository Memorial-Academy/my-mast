import LabelledInput from "@/components/LabelledInputs";

export default function ParentSignupPage() {
    return (
        <>
            <h2>Parent Information</h2>
            <LabelledInput
                question="First Name"
                placeholder="First name"
                required
                name="parent_first-name"
            />
            <LabelledInput
                question="Last Name"
                placeholder="Last name"
                required
                name="parent_last-name"
            />
            <LabelledInput
                question="Phone Number"
                placeholder="Phone number"
                required
                name="parent_phone-number"
            />
        </>
    )
}
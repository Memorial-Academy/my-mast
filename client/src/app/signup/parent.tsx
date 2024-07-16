import LabelledInput from "@/components/LabelledInputs";

export default function ParentSignupPage() {
    return (
        <>
            {/* <input style={{display: "none"}} value="parent" name="role" tabIndex={-1}/> */}

            <h2>Let's start with some basic info...</h2>
            <LabelledInput
                question="Email address"
                placeholder="Email"
                required
                name="email"
            />
            <LabelledInput
                question="Password"
                placeholder="Password"
                required
                protected
                name="password"
            />

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
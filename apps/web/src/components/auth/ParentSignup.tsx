import LabelledInput from "@/components/LabelledInputs";

export default function ParentSignupPage() {
    return (
        <>
            <input readOnly className="signup-role-tracker" value="parent" title="role" name="role" />
            <p>Almost done! After you click "Create Account," you'll be redirected to your dashboard, where you can enter information for your students.</p>
        </>
    )
}
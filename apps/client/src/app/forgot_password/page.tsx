import { Metadata } from "next";
import "@/styles/auth.css";
import { RequestPasswordReset } from "@/components/auth/ResetPassword";

export const metadata: Metadata = {
    title: "Reset Password | MyMAST"
}

export default function Home() {
    return (
        <>
            <div id="auth">
                <h1>Reset your MyMAST password</h1>
                <RequestPasswordReset />
            </div>
        </>
    )
}
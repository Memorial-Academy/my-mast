import { Metadata } from "next";
import "@/styles/auth.css";

import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
    title: "Create Account | MyMAST",
};

export default function Home() {
    return (
        <>
            <div id="auth">
                <img alt="MAST seal" src="/seal.svg" />
                <h1>Welcome to MyMAST</h1>
                <p>Create an account to enroll, volunteer, and participate in our programs!</p>
                    <SignupForm />
            </div>
        </>
    );
}

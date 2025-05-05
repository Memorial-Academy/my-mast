import { Metadata } from "next";
import "@/styles/auth.css";

import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
    title: "Create Account | MyMAST",
};

export default function Page({searchParams}: {searchParams: {program_redirect: string} | undefined}) {
    return (
        <>
            <div id="auth">
                <img alt="MAST seal" src="/seal.svg" />
                <h1>Welcome to MyMAST</h1>
                <p>
                    Create an account to enroll, volunteer, and participate in our programs!
                    <br/>
                    Creating an account allows you to quickly and easily sign-up for programs. You'll never have to manually re-enter all your information every time you sign up for a program.
                </p>
                    <SignupForm programRedirect={searchParams?.program_redirect} />
            </div>
        </>
    );
}

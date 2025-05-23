"use client";
import Authenticate from "@/app/lib/auth";
import { LabelledInput } from "@mymast/ui";
import LoginButton from "@/components/auth/LoginButton";
import { useState } from "react";

export default function LoginFom({programRedirect}: {programRedirect?: string}) {
    const [formMessage, setFormMessage] = useState("");

    async function formSubmissionHandler(data: FormData) {
        setFormMessage(""); // blank message on every login attempt
        const status = await Authenticate(data, "/auth/login", programRedirect);
        
        if (status) {
            // setFormMessage("Could not login. Make sure the email and password are correct.");
            setFormMessage(status);
        }
    }

    return (
        <>
            <form action={formSubmissionHandler}>

                <LabelledInput
                    question="Email"
                    name="email"
                    placeholder="Email"
                    required
                />
                <LabelledInput
                    question="Password"
                    name="password"
                    placeholder="Password"
                    required
                    type="protected"
                />
                <p id="form-message">{formMessage}</p>
                <LoginButton text="Login" />
                <p id="password_reset"><a href="/forgot_password">Reset password</a></p>
                <p>
                    Don't have an account? <a href={programRedirect ? `/signup?program_redirect=${programRedirect}` : "/signup"}>Create one today</a> to enroll in and volunteer for MAST programs!
                </p>
                <p>
                    MyMAST is a central dashboard to manage everything related to your participation in MAST programs.
                </p>
            </form>
        </>
    )
}
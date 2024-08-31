"use client";
import Authenticate from "@/app/lib/auth";
import { LabelledInput } from "@mymast/ui";
import LoginButton from "@/components/auth/LoginButton";
import { useState } from "react";

export default function Home() {
    const [formMessage, setFormMessage] = useState("");

    async function formSubmissionHandler(data: FormData) {
        const status = await Authenticate(data, "/auth/login");
        
        if (status) {
            setFormMessage("Could not login. Make sure the email and password are correct.");
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
                  protected
                />
                <p id="form-message">{formMessage}</p>
                <LoginButton text="Login" />
                <p>
                  Don't have an account? <a href="/signup">Create one today</a> to enroll in and volunteer for MAST programs!
                </p>
                <p>
                  MyMAST is a central dashboard to manage everything related to your participation in MAST programs.
                </p>
            </form>
        </>
    )
}
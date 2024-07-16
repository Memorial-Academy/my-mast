"use client";
import LoginButton from "@/components/auth/LoginButton";
import { useState } from "react";
import { MultipleChoice } from "../LabelledInputs";
import { signupUser } from "@/app/lib/auth";
import LabelledInput from "../LabelledInputs";

import ParentSignupPage from "@/app/signup/parent";

export default function SignupForm() {
    const [userRole, setUserRole] = useState("");
    
    return (
        <>
            <form onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setUserRole(target.value)
            }}>
                <h2>I am a...</h2>
                <MultipleChoice
                    name="user-role"
                    values={[
                        "Parent", "Volunteer"
                    ]}
                    required
                    type="radio"
                />
            </form>
            <form id="signup" action={signupUser}>
                {(userRole != "") && <>
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
                </>}

                {(userRole == "parent") && <ParentSignupPage />}
                
                {(userRole != "") && <>
                    <input type="checkbox" name="agreement" id="agreement" required />
                    <label htmlFor="agreement">I agree to the Privacy Policy and Terms of Service for the Memorial Academy of Science and Technology</label>
                    <LoginButton text="Create Account" />
                </>}
            </form>
        </>
    )
}
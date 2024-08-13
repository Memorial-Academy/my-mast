"use client";
import LoginButton from "@/components/auth/LoginButton";
import { useState } from "react";
import { MultipleChoice } from "../LabelledInputs";
import Authenticate from "@/app/lib/auth";
import LabelledInput from "../LabelledInputs";

import ParentSignupPage from "./ParentSignup";
import VolunteerSignupPage from "./VolunteerSignup";

export default function SignupForm() {
    const [userRole, setUserRole] = useState("");
    const [formMessage, setFormMessage] = useState("");

    async function formSubmissionHandler(data: FormData) {
        const status = await Authenticate(data, "/auth/signup");
        
        if (status) {
            setFormMessage("Could not create account");
        }
    }
    
    return (
        <>
            <form onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setUserRole(target.value);
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
            <form id="signup" action={formSubmissionHandler}>
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

                    <h2>General Information</h2>
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
                </>}

                {(userRole == "parent") && <ParentSignupPage />}
                {(userRole == "volunteer") && <VolunteerSignupPage />}
                
                {(userRole != "") && <>
                    <input type="checkbox" name="agreement" id="agreement" required value="agree" />
                    <label htmlFor="agreement">I agree to the Privacy Policy and Terms of Service for the Memorial Academy of Science and Technology</label>
                    <p id="form-message">{formMessage}</p>
                    <LoginButton text="Create Account" />
                </>}
            </form>
        </>
    )
}
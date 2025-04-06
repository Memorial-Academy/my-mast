"use client";
import { LabelledInput } from "@mymast/ui";
import LoginButton from "./LoginButton";
import { useRef, useState} from "react";
import { sendPasswordResetEmail, submitNewPassword } from "@/app/lib/reset_password";
import { useRouter } from "next/navigation";

export function RequestPasswordReset() {
    const [resetRequested, setResetRequested] = useState(false);
    const [email, setEmail] = useState("");

    async function passwordResetHandler(data: FormData) {
        var providedEmail = data.get("email")!.toString()
        setResetRequested(true);
        setEmail(providedEmail);
        sendPasswordResetEmail(providedEmail);
    }

    return (
        <>
            {!resetRequested && <>
                <p>Enter the email address for your MyMAST account. If that email address exists in our system, we'll send you a link to reset your password.</p>
                <form action={passwordResetHandler}>
                    <LabelledInput
                        question="Email"
                        name="email"
                        placeholder="Email"
                        required
                    />
                    <LoginButton text="Submit" />
                </form>
            </>}
            {resetRequested && <>
                <p>
                    Check the email address "{email}". If this email address is linked to a MyMAST account, an email will be sent with a unique link to reset your password.
                </p>
                <p>
                    Please note that emails may take a few minutes to arrive.
                    <br/>
                    If the email does not arrive, resend it with the button below.
                </p>
                <ResendLink email={email} />
            </>}
        </>
    )
}

function ResendLink({email}: {email: string}) {
    const [time, setTimeRemaining] = useState(30);
    const [helpTip, setHelpTip] = useState(false);
    
    const resendWaitTime = useRef(setInterval(()=>{},10000));

    clearInterval(resendWaitTime.current);
    function countdown() {
        resendWaitTime.current = setInterval(() => {
            if (time > 0) {
                setTimeRemaining(time - 1);
            } else {
                clearInterval(resendWaitTime.current);
            }
        },1000)
    }
    countdown();

    function resendEmail() {
        setHelpTip(true);
        sendPasswordResetEmail(email);
        setTimeRemaining(30);
        countdown();
    }

    return (
        <>
            {(time <= 0) ? 
                (<p>
                    <a 
                        href="#"
                        onClick={resendEmail}
                    >
                        Click here to resend email
                    </a>
                </p>) : (<p>
                    Wait {time} second{time == 1 ? "" : "s"} to resend.
                </p>)
            }
            {helpTip && <p>No email? Make sure you've entered the correct email address, or contact <a href="mailto:hello@memorialacademy.org">hello@memorialacademy.org</a>.</p>}
        </>
    )
}

export function NewPassword({token}: {token: string}) {
    const [message, setMessage] = useState("");
    const [completed, setCompleted] = useState(false);
    const Router = useRouter();
    
    async function resetPassword(data: FormData) {
        setMessage("");
        if (data.get("password") == data.get("password2")) {
            var response = await submitNewPassword(data.get("password")!.toString(), token);
            if(response != 200) {
                setMessage("Error resetting password. Please try again or submit a new request.");
            } else {
                setCompleted(true);
                setTimeout(() => {
                    Router.replace("/");
                }, 7000)
            }
        } else {
            setMessage("Passwords do not match");
        }
    }

    return (
        <>
            {!completed && <>
                <p>
                    Please enter your new password below.
                    <br/>
                    Please note resetting your password will log you out on all devices you are currently logged in on.
                </p>
                <form action={resetPassword}>
                    <LabelledInput
                        question="Password"
                        name="password"
                        placeholder="Password"
                        type="protected"
                        required
                    />
                    <LabelledInput
                        question="Confirm Password"
                        name="password2"
                        placeholder="Password"
                        type="protected"
                        required
                    />
                    <p id="form-message">{message}</p>
                    <LoginButton text="Submit" />
                </form>
            </>}
            {completed && <>
                <p>Your password has been reset!</p>
                <p>You'll be redirected to the login page shortly.</p>
            </>}
        </>
    )
}
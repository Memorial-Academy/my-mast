"use client";
import { LabelledInput } from "@mymast/ui";
import LoginButton from "./LoginButton";
import { useRef, useState} from "react";

export function RequestPasswordReset() {
    const [resetRequested, setResetRequested] = useState(false);
    const [email, setEmail] = useState("");

    async function passwordResetHandler(data: FormData) {
        // console.log(data.get("email"));
        setResetRequested(true);
        setEmail(data.get("email")!.toString());
    }

    return (
        <>
            {!resetRequested && <>
                <p>Enter the email address for your MyMAST account. If that email address exists in our system, we'll send you a code to reset your password.</p>
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
                    Check the email address "{email}" and visit the unique link we sent you.
                </p>
                <p>
                    Please note that emails may take a few minutes to arrive.
                    <br/>
                    If the email does not arrive, resend it with the button below.
                </p>
                <ResendLink />
            </>}
        </>
    )
}

function ResendLink() {
    const [time, setTimeRemaining] = useState(20);
    
    const resendWaitTime = useRef(setInterval(()=>{},10000));

    clearInterval(resendWaitTime.current);
    resendWaitTime.current = setInterval(() => {
        if (time > 0) {
            setTimeRemaining(time - 1);
            console.log("counting")
        } else {
            clearInterval(resendWaitTime.current);
        }
    },1000)

    return (
        <>
            {(time <= 0) ? 
                (<p>
                    <a 
                        href="#"
                    >
                        Click here to resend email
                    </a>
                </p>) : (<p>
                    Wait {time} seconds to resend.
                </p>)
            }
        </>
    )
}
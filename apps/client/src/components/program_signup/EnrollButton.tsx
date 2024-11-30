"use client";
import { useRouter } from "next/navigation";
import React from "react";

type EnrollButtonProps = {
    signupType: "enroll" | "volunteer",
    uuid?: string
}

export default function EnrollButton(props: EnrollButtonProps) {
    const router = useRouter();
    let text = "";

    if (props.uuid) {
        if (props.signupType == "enroll") {
            text = "Enroll your student(s)!";
        } else if (props.signupType == "volunteer") {
            text = "I'm ready to volunteer!";
        }
    } else {
        if (props.signupType == "enroll") {
            text = "Enroll for free!";
        } else if (props.signupType == "volunteer") {
            text = "I want to volunteer!";
        }
    }

    function signupHandler() {
        if (!props.uuid) {
            alert(`You need an account in order to ${props.signupType == "volunteer" ? "volunteer for" : "enroll in"} a program! Click \"OK\" to go to the login/create account page!`);
            router.push("/");
        } else {
            
        }
    }
    
    return (
        <button title={text} onClick={signupHandler}>
            {text}
        </button>
    )
}
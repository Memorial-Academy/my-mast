"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Popup } from "@mymast/ui";
import StudentEnrollmentPopup from "./StudentEnrollmentPopup";
import VolunteerEnrollmentPopup from "./VolunteerEnrollmentPopup";

type EnrollButtonProps = {
    signupType: "enroll" | "volunteer",
    program: ProgramData
    uuid?: string,
    sessionToken?: string,
    students?: Array<{
        name: {
            first: string,
            last: string,
        },
        uuid: string
    }>
}

export default function EnrollButton(props: EnrollButtonProps) {
    const [popupActive, setPopupActive] = useState(false);
    const router = useRouter();
    let text = "";

    if (props.uuid) {
        if (props.signupType == "enroll") {
            text = `Enroll your student${props.students!.length > 1 ? "s" : ""}!`;
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
            setPopupActive(true);
        }
    }


    return (
        <>
            <button 
                className="big-button"
                title={text} 
                onClick={signupHandler}
            >
                {text}
            </button>
            <Popup active={popupActive} onClose={() => {setPopupActive(false)}}>
                <h2>Let's {props.signupType == "volunteer" ? "volunteer" : "get enrolled"}!</h2>
                
                {(props.signupType == "enroll" && props.students) ? <>
                    <StudentEnrollmentPopup 
                        students={props.students}
                        program={props.program}
                    />
                </> : <VolunteerEnrollmentPopup program={props.program} />}
            </Popup>
        </>
    )
}
"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Popup } from "@mymast/ui";
import StudentEnrollmentPopup from "./StudentEnrollmentPopup";
import VolunteerEnrollmentPopup from "./VolunteerEnrollmentPopup";
import { Program } from "@mymast/api/Types";
import API from "@/app/lib/APIHandler";
import { usePlausible } from "next-plausible";

type EnrollButtonProps = {
    signupType: "enroll" | "volunteer",
    program: Program
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
    const [email, setEmail] = useState<string>("");
    const router = useRouter();
    const plausible = usePlausible();
    let text = "";

    if (props.uuid && props.sessionToken) {
        if (props.signupType == "enroll") {
            API.User.profile("parent", props.uuid, props.sessionToken).then(res => {
                setEmail(res.email)
            });
            text = `Enroll your student${props.students!.length > 1 ? "s" : ""}!`;
        } else if (props.signupType == "volunteer") {
            API.User.profile("volunteer", props.uuid, props.sessionToken).then(res => {
                setEmail(res.email)
            });
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
            alert(`You need an account in order to ${props.signupType == "volunteer" ? "volunteer for" : "enroll in"} a program! Click \"OK\" to go to the login/create account page!\nOnce you're done, you'll be bought back to this page!`);
            plausible("ProgramSignupAuthRedirect", {props: {
                signupType: props.signupType,
                program: props.program.name
            }});
            router.push(`/?program_redirect=${props.program.id}`);
        } else {
            setPopupActive(true);
            if (props.signupType == "volunteer") {
                plausible("ProgramSignupOpened_Volunteer", {props: {
                    program: props.program.name
                }});
            } else {
                plausible("ProgramSignupOpened_Parent", {props: {
                    program: props.program.name
                }});
            }
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
            <Popup active={popupActive} onClose={() => {
                setPopupActive(false);
                if (props.signupType == "volunteer") {
                    plausible("ProgramSignupClosed_Volunteer", {props: {
                        program: props.program.name
                    }});
                } else {
                    plausible("ProgramSignupClosed_Parent", {props: {
                        program: props.program.name
                    }});
                }
            }}>
                <h2>Let's {props.signupType == "volunteer" ? "volunteer" : "get enrolled"}!</h2>
                
                {(props.signupType == "enroll" && props.students) ? <>
                    <StudentEnrollmentPopup 
                        students={props.students}
                        program={props.program}
                        email={email}
                    />
                </> : <VolunteerEnrollmentPopup 
                    program={props.program} 
                    email={email}
                />}
            </Popup>
        </>
    )
}
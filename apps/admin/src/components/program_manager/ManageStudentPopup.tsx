"use client";
import API from "@/app/lib/APIHandler";
import { ConfirmationPopup, Popup } from "@mymast/ui";
import { useState } from "react";

type ManageStudentPopupProps = {
    notes?: string,
    name: {
        first: string,
        last: string
    },
    parentName: {
        first: string,
        last: string
    },
    parentContact: {
        email: string,
        phone: string
    },
    program: string,
    enrollmentID: string,
    courseName: string,
    week: number,
    auth: {
        uuid: string,
        token: string
    }
}

export default function ManageStudentPopup(props: ManageStudentPopupProps) {
    const [active, setActive] = useState(false);
    let hasNotes = true;

    if (!props.notes) {
        hasNotes = false;
    } else {
        let noteCheck = props.notes.toLowerCase();

        if (noteCheck == "n/a" || noteCheck == "none" || noteCheck == "no") {
            hasNotes = false;
        }
    }


    return (
        <>
            <a href="#" onClick={e => {
                e.preventDefault();
                setActive(true);
            }}>Notes & actions</a>
            <Popup 
                active={active}
                onClose={() => {setActive(false)}}
            >
                <h2>{props.name.first} {props.name.last}</h2>
                <p>
                    <b>Parent: {props.parentName.first} {props.parentName.last}</b>
                    <br/>
                    Email: {props.parentContact.email}
                    <br/>
                    Phone: {props.parentContact.phone}
                </p>
                
                <h3>Student Notes</h3>
                {hasNotes ? <p>"{props.notes}"</p> : <p>No notes</p>}
                
                <h3>Mangage Student</h3>
                <ConfirmationPopup
                    buttonText="Unenroll"
                    message={`You are about to unenroll ${props.name.first} ${props.name.last} from "${props.courseName}," week ${props.week}. This action is permanent. Are you sure you want to continue?`}
                    callback={async () => {
                        await API.Admin.unenrollStudent(
                            props.auth.uuid,
                            props.auth.token,
                            props.program,
                            props.enrollmentID
                        )
                    }}
                    reload
                    buttonStyle="button"
                />
            </Popup>
        </>
    )
}
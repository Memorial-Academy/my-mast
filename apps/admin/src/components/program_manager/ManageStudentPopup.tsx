"use client";
import API from "@/app/lib/APIHandler";
import { EmergencyContact, FullName } from "@mymast/api/Types";
import { ConfirmationPopup, Popup } from "@mymast/ui";
import { useState } from "react";

type ManageStudentPopupProps = {
    notes?: string,
    name: FullName,
    parentName: FullName,
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
    },
    emergencyContact: EmergencyContact
}

export default function ManageStudentPopup(props: ManageStudentPopupProps) {
    const [active, setActive] = useState(false);
    let hasNotes = true;

    if (!props.notes) {
        hasNotes = false;
    } else {
        let noteCheck = props.notes.toLowerCase();
        if (["n/a","none","no"].indexOf(noteCheck) != -1) {
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
                <h2>Student: {props.name.first} {props.name.last}</h2>
                <div className="bi-fold">
                    <ParentInfoDisplay
                        contactType="Parent"
                        name={props.parentName}
                        email={props.parentContact.email}
                        phone={props.parentContact.phone}
                    />
                    <ParentInfoDisplay
                        contactType="Emergenct Contact"
                        name={props.emergencyContact.name}
                        email={props.emergencyContact.email}
                        phone={props.emergencyContact.phone}
                    />
                </div>
                
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

function ParentInfoDisplay({name, phone, email, contactType}: {name: FullName, phone: string, email: string, contactType: string}) {
    return (
        <p>
            <b>{contactType}: {name.first} {name.last}</b>
            <br/>
            Email: <a href={`mailto:${email}`}>{email}</a>
            <br/>
            Phone: <a href={`tel:${phone}`}>{phone}</a>
        </p>
    )
}
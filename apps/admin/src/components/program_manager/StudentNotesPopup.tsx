"use client";
import { Popup } from "@mymast/ui";
import { useState } from "react";

type StudentNotesPopupProps = {
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
    }
}

export default function StudentNotesPopup(props: StudentNotesPopupProps) {
    const [active, setActive] = useState(false)
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
        hasNotes ? <>
            <a href="#" onClick={e => {
                e.preventDefault();
                setActive(true);
            }}>View notes</a>
            <Popup 
                active={active}
                onClose={() => {setActive(false)}}
            >
                <h2>Notes for {props.name.first} {props.name.last}</h2>
                <p>
                    <b>Parent: {props.parentName.first} {props.parentName.last}</b>
                    <br/>
                    Email: {props.parentContact.email}
                    <br/>
                    Phone: {props.parentContact.phone}
                </p>
                <p>"{props.notes}"</p>
            </Popup>
        </> : <>None</>
    )
}
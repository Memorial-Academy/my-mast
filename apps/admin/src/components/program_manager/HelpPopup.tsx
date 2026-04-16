"use client";
import { Popup } from "@mymast/ui";
import { ReactNode, useState } from "react"

export function NewProgramHelpPopup({InfoElem}: {InfoElem: () => JSX.Element}) {
    const [active, setActive] = useState(false);

    return <>
        <a 
            className="create-program-help-link"
            href="#"
            onClick={(e) => {
                e.preventDefault();
                setActive(true);
            }}
        >What's this?</a>
        <Popup
            active={active}
            onClose={() => {
                setActive(false)
            }}
            persist={false}
        >
            <h2>Create Program Help</h2>
            <InfoElem />
        </Popup>
    </>
}

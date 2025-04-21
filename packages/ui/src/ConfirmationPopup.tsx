"use client";
import React, { useState } from "react";
import { Popup } from "./Popup";

type ConfirmationPopupProps = {
    buttonText: string
    message: string
    callback: () => any,
    reload?: boolean
}

export function ConfirmationPopup(props: ConfirmationPopupProps) {
    const [active, setActive] = useState(false);

    return (
        <>
            <a 
                href="#"
                className="action-link"
                onClick={(e) => {
                    e.preventDefault();
                    setActive(true);
                }}
                role="button"
            >{props.buttonText}</a> 
            <Popup
                active={active}
                onClose={() => {
                    setActive(false);
                }}
            >
                <h2>Please confirm!</h2>
                <p>{props.message}</p>
                <button 
                    type="button"
                    onClick={() => {
                        props.callback();
                        setActive(false);
                        if (props.reload) {
                            window.location.reload();
                        }
                    }}
                >
                    Confirm
                </button>
                <button 
                    type="button"
                    onClick={() => {
                        setActive(false);
                    }}
                >
                    Cancel
                </button>
            </Popup>
        </>
    )
}
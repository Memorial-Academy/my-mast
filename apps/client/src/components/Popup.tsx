"use client";
import React from "react";
import "@/styles/popup.css";

type PopupProps = {
    active: boolean,
    children: React.ReactNode,
    onClose: Function
}

export default function Popup(props: PopupProps) {
    function wrapperClick(e: React.MouseEvent<HTMLElement>) {
        if ((e.target as HTMLElement).className == "popup-wrapper") {
            props.onClose();
        }
    }

    return (
        <div 
            className="popup-wrapper" 
            onClick={wrapperClick}
            style={{
                display: (props.active ? "block" : "none")
            }}
        >
            <div className="popup">
                <p className="popup-close" title="Close" onClick={(e) => {
                    props.onClose()
                }}>X</p>
                {props.children}
            </div>
        </div>
    )
}
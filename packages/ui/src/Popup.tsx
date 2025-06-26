"use client";
import React from "react";
import "../styles/popup.css";

type PopupProps = {
    active: boolean,
    children: React.ReactNode,
    onClose: Function,
    persist?: boolean
}

export function Popup(props: PopupProps) {
    let persist = (props.persist === undefined) ? true : props.persist;
    function wrapperClick(e: React.MouseEvent<HTMLElement>) {
        if ((e.target as HTMLElement).className == "popup-wrapper") {
            props.onClose();
        }
    }

    if (persist) {
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
    } else {
        return (
            <>
                {props.active ? <div 
                    className="popup-wrapper" 
                    onClick={wrapperClick}
                    style={{
                        display: "block"
                    }}
                >
                    <div className="popup">
                        <p className="popup-close" title="Close" onClick={(e) => {
                            props.onClose()
                        }}>X</p>
                        {props.children}
                    </div>
                </div> : <></>}
            </>
        )
    }

    return (
        <>
            {(props.active && !persist) ? <div 
                className="popup-wrapper" 
                onClick={wrapperClick}
                style={{
                    display: ((props.active && persist) ? "block" : (!persist ? "block" : "none"))
                }}
            >
                <div className="popup">
                    <p className="popup-close" title="Close" onClick={(e) => {
                        props.onClose()
                    }}>X</p>
                    {props.children}
                </div>
            </div> : <></>}
        </>
    )
}
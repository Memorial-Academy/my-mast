"use client";
import React from "react";
import "@/styles/protected_input.css";

export default function ProtectedInput({placeholder}: {placeholder: string}) {
    const [isHidden, setIsHidden] = React.useState(true);

    const toggleHidden = () => {
        setIsHidden(!isHidden);
    } 
    
    return (
        <div className="protected-input">
            <input type={isHidden ? "password" : "text"} placeholder={placeholder} required />
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="16" viewBox="-1 0 34 16" onClick={toggleHidden} >
                <path d="M0 8 A16 8 180 0 1 32 8 A16 8 -180 0 1 0 8" strokeWidth="2" stroke="black" fill="none" />
                <circle cx="16" cy="8" r="6" fill="none" strokeWidth="2" stroke="black"  />
                {isHidden ? <path d="M32 0 L0 16" strokeWidth="2" stroke="black" /> : <></>}
            </svg>
        </div>
    )
}
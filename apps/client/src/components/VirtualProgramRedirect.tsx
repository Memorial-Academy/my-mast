"use client";

import { useEffect } from "react";

export default function VirtualProgramRedirect({link}: {link: string}) {
    useEffect(() => {
        setTimeout(() => {
            window.location.replace(link);
        }, 5000)
    })
    
    return (
        <a href={link}>{link}</a>
    )
}
import React from "react";
import "@/styles/header.css";

type HeaderProps = {
    homeLink: string,
}

export default function Header(props: HeaderProps) {
    return (
        <header>
            <a href={props.homeLink} >
                <img src="/logo_background.svg" alt="MAST logo" />
                <h1>Memorial Academy of Science and Technology</h1>
            </a>
        </header>
    )
}
import React from "react";
import "@/styles/header.css";
import LogoutButton from "./auth/LogoutButton";
import authorizeSession from "@mymast/utils/authorize_session";

type HeaderProps = {
    homeLink: string,
}

export default async function Header(props: HeaderProps) {
    return (
        <header>
            <a href={props.homeLink} className="title">
                <img src="/logo_background.svg" alt="MAST logo" />
                <h1>
                    Memorial Academy
                    <br/>
                    of Science and Technology
                </h1>
            </a>
            {await authorizeSession() && <nav>
                <a href="/programs">Programs</a>
                <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <a href="/account">Account</a>
                <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <LogoutButton />
            </nav>}
        </header>
    )
}
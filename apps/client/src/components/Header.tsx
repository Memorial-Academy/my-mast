import React from "react";
import "@/styles/header.css";
import LogoutButton from "./auth/LogoutButton";
import authorizeSession from "@mymast/utils/authorize_session";
import Link from "next/link";

export default async function Header() {
    let session = await authorizeSession();

    return (
        <header>
            <Link href={session ? "/dashboard" : "/programs"} className="title">
                <img src="/logo_background.svg" alt="MAST logo" />
                <h1>
                    Memorial Academy
                    <br/>
                    of Science and Technology
                </h1>
            </Link>
            {session && <nav>
                <Link href="/programs">Programs</Link>
                <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <Link href="/account">Account</Link>
                <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <LogoutButton />
            </nav>}
        </header>
    )
}
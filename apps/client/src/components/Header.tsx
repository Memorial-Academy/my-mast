import React from "react";
import "@/styles/header.css";
import LogoutButton from "./auth/LogoutButton";
import authorizeSession from "@mymast/utils/authorize_session";
import Link from "next/link";

export default async function Header() {
    let session = await authorizeSession();

    let adminCheck = false;

    if (session) {
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admincheck`, {
            method: "POST",
            body: JSON.stringify({
                uuid: session.uuid,
                token: session.token
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (res.status == 200) {
            adminCheck = true;
        }
    }

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
                {adminCheck && <>
                    <Link href={process.env.NEXT_PUBLIC_ADMIN_URL || "admin.memorialacademy.org"}>Admin Control Panel</Link>
                    <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                </>}
                <Link href="/programs">Programs</Link>
                <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <Link href="/account">Account</Link>
                <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <LogoutButton />
            </nav>}
        </header>
    )
}
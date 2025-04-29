import React from "react";
import "@/styles/header.css";
import authorizeSession from "@mymast/utils/authorize_session";
import Link from "next/link";
import Nav from "./Nav";

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
            {session && <Nav adminCheck={adminCheck} />}
        </header>
    )
}
"use client";
import Link from "next/link"
import LogoutButton from "./auth/LogoutButton";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type NavProps = {
    adminCheck: boolean
}

const MobileNavContext = createContext<undefined | Dispatch<SetStateAction<boolean>>>(undefined);

export default function Nav({adminCheck}: NavProps) {
    const [mobileNavActive, setMobileNavActive] = useState(false);

    return (
        <div className="nav-wrapper">
            <button
                title="Open navigation menu"
                type="button"
                id="open-mobile-nav"
                onClick={e => {
                    setMobileNavActive(true);
                }}
            >
                <svg viewBox="0 0 6 6">
                    <path d="M0 1 l6 0 M0 3 l6 0 M0 5 l6 0" stroke="#000000" strokeWidth="1" />
                </svg>
            </button>
            <nav className={mobileNavActive ? "active-mobile-nav" : ""}>
                <a 
                    href="#" 
                    id="close-mobile-nav"
                    onClick={(e) => {
                        e.preventDefault();
                        setMobileNavActive(false);
                    }}
                >Close&nbsp;&nbsp;X</a>
                <MobileNavContext.Provider value={setMobileNavActive}>
                    {adminCheck && <NavLink 
                        link={process.env.NEXT_PUBLIC_ADMIN_URL || "https://admin.memorialacademy.org"}
                        text="Admin Panel"
                    />}

                    <NavLink
                        link="/dashboard"
                        text="Home"
                    />
                    <NavLink
                        link="/programs"
                        text="Programs"
                    />
                    <NavLink
                        link="/dashboard/account"
                        text="Account"
                    />
                    <LogoutButton />
                </MobileNavContext.Provider>
            </nav>
        </div>
    )
}

type NavLinkProps = {
    link: string,
    text: string,
    last?: boolean
}

function NavLink({link, text, last}: NavLinkProps) {
    const setMobileNavActive = useContext(MobileNavContext);
    return (
        <>
            <Link 
                href={link}
                onClick={e => {
                    if (setMobileNavActive) setMobileNavActive(false);
                }}
            >{text}</Link>
            {!last && <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>}
        </>
    )
}
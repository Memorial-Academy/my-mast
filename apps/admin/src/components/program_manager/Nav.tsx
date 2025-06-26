"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

const IDContext = createContext<{
    id: string,
    mobileNav: Dispatch<SetStateAction<boolean>> | undefined
}>({
    id: "",
    mobileNav: undefined
});

export default function ProgramManagerNav({id, name}: {id: string, name: string}) {
    const [mobileNavActive, setMobileNavActive] = useState(false);

    return (
        <nav className={`program-manager-nav ${mobileNavActive ? "mobile-nav-active" : ""}`}>
            <h2>Program Manager: {name}</h2>
            <IDContext.Provider value={{
                id,
                mobileNav: setMobileNavActive
            }}>
                <NavLink
                    link=""
                    text="Information"
                />
                <p><b>Enrollments</b></p>
                <NavLink
                    link="enrollment/students"
                    text="Students"
                />
                <NavLink
                    link="enrollment/volunteers"
                    text="Volunteers"
                />
                <p><b>Attendance & Hours</b></p>
                {/* <NavLink
                    link="attendance/students"
                    text="Student Attendance"
                /> */}
                <NavLink
                    link="attendance/volunteers"
                    text="Volunteer Attendance & Hours"
                />
            </IDContext.Provider>
            <a 
                id="close-mobile-nav"
                href="#"
                title="Close navigation menu"
                role="button"
                onClick={(e) => {
                    e.preventDefault();
                    setMobileNavActive(false);
                }}
            >Close</a>
            <button 
                id="open-mobile-nav"
                title="Open navigation menu"
                onClick={(e) => {
                    e.preventDefault();
                    setMobileNavActive(true);
                }}
            >|||</button>
        </nav>
    )
}

type NavLinkProps = {
    link: string,
    text: string
}

function NavLink({link, text}: NavLinkProps) {
    const {id, mobileNav} = useContext(IDContext);
    const path = usePathname().replace(/\/[a-z]*\/[0-9a-zA-Z]*\/{0,1}/gm, "");

    return (
        <Link 
            href={`/program/${id}${link ? `/${link}` : ""}`}
            className={path == link ? "active-link" : ""}
            onClick={(e) => {
                if (mobileNav) {
                    mobileNav(false);
                }
            }}
        >{text}</Link>
    )
}
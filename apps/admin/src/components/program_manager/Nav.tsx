"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext } from "react";

const IDContext = createContext("");

export default function ProgramManagerNav({id, name}: {id: string, name: string}) {


    return (
        <nav className="program-manager-nav">
            <h2>Program Manager: {name}</h2>
                <IDContext.Provider value={id}>
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
            </IDContext.Provider>
        </nav>
    )
}

type NavLinkProps = {
    link: string,
    text: string
}

function NavLink({link, text}: NavLinkProps) {
    const id = useContext(IDContext);
    const path = usePathname().replace(/\/[a-z]*\/[0-9a-zA-Z]*\/{0,1}/gm, "");

    return (
        <Link 
            href={`/program/${id}${link ? `/${link}` : ""}`}
            className={path == link ? "active-link" : ""}
        >{text}</Link>
    )
}
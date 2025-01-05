"use client";
import logoutUser from "@/app/lib/logout";

export default function LogoutButton() {
    return (
        <a href="#" onClick={e => {
            e.preventDefault();
            logoutUser();
        }}>Logout</a>
    )
}
import Header from "@/components/Header";
import React from "react";
import "@/styles/dashboard_global.css";

export default function DashboardLayout({ children }: { children: React.ReactNode}) {
    return (
        <>
            {/* <nav>
                <a className="logo" href="/dashboard" >
                    <img src="/logo_background.svg" alt="MAST logo" />
                    <h1>Memorial Academy of<br/>Science and Technology</h1>
                </a>
            </nav> */}
            <Header />
            <main className="dashboard">
                {children}
            </main>
        </>
    )
}
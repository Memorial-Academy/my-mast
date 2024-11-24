import React from "react";
import "@/styles/dashboard_global.css";

export default function DashboardLayout({ children }: { children: React.ReactNode}) {
    return (
        <>
            <nav>
                <a className="logo" href="/dashboard" >
                    {/* <img src="/seal.svg" alt="MAST logo" /> */}
                    <img src="/logo_background.svg" alt="MAST logo" />
                    <h1>Memorial Academy of<br/>Science and Technology</h1>
                </a>
            </nav>
            <main>
                {children}
            </main>
        </>
    )
}
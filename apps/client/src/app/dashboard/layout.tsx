import Header from "@/components/Header";
import React from "react";
import "@/styles/dashboard_global.css";

export default function DashboardLayout({ children }: { children: React.ReactNode}) {
    return (
        <>
            <Header />
            <main className="dashboard">
                {children}
            </main>
        </>
    )
}
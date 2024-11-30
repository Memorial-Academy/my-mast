import { ReactNode } from "react";
import Header from "@/components/Header";
import "@/styles/enroll.css";

export default function Layout({children}: {children: ReactNode}) {
    return (
        <>
            <Header homeLink="/programs" />
            <main>
                {children}
            </main>
        </>
    )
}
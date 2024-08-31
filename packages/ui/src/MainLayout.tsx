import React from "react";
import "../styles/globals.css"

export function Layout({children}: {children: React.ReactNode}) {
    return (
        <body>
            {children}
        </body>
    )
}
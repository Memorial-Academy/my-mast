import React, { Suspense } from "react";
import "../styles/globals.css"
import { Loading } from "./Loading";

export function Layout({children}: {children: React.ReactNode}) {
    return (
        <body>
            {/* <Suspense fallback={<Loading/>}> */}
                {children}
            {/* </Suspense> */}
        </body>
    )
}
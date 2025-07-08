import React, { Suspense } from "react";
import "../styles/globals.css"
import { Loading } from "./Loading";
import Footer from "./Footer";

export function Layout({children}: {children: React.ReactNode}) {
    return (
        <body>
            {/* <Suspense fallback={<Loading/>}> */}
                {children}
            {/* </Suspense> */}
            <Footer/>
        </body>
    )
}
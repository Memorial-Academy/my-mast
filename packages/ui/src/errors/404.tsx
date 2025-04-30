import Link from "next/link";
import React from "react";
import "../../styles/error.css";

export function NotFoundUI() {
    return (
        <div className="error-wrapper">
            <h2>Whoops!</h2>
            <p>We couldn't find that page. Make sure the URL is correct, then try going back <Link href="/">home</Link> and searching for this page again.</p>
        </div>
    )
}
import React from "react";
import "../../styles/error.css";

export function ErrorUI({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="error-wrapper">
            <h2>Whoops! We encountered a problem loading this page</h2>
            <p>
                <a href="#">Click here</a>
                &nbsp;to try and reload the page. If that doesn't resolve the problem, try going
                &nbsp;<a href="/">home</a>
                &nbsp;and attempting to navigate back to the correct page.
            </p>
        </div>
    )
}
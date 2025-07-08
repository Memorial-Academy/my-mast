"use client";
import React from "react";

type ReloadPageProps = {
    userConfirm?: boolean
}

export function ReloadPage({userConfirm}: ReloadPageProps) {
    return (
        <button onClick={() => {
            let confirmation = userConfirm ? false : true;
            if (userConfirm) {
                confirmation = confirm("You are about to reload the page. Any unsaved work will be lost. Are you sure you want to continue?")
            }
            if (confirmation) {
                window.location.reload();
            }
        }}>Reload</button>
    )
}
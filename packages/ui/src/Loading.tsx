import React from "react";
import "../styles/loading.css";

export function Loading() {
    return (
        <div className="loading-wrapper">
            <img src="/sailboat.png" alt="MAST sailboat logo"/>
            <p>Loading...</p>
        </div>
    )
}
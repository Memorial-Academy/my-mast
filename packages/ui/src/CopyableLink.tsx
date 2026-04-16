"use client";
import React from "react"
import Link from "next/link"

export function CopyableLink({link, displayText}: {link: string, displayText?: string}) {
    "use client"
    return <span>
        <Link target="_blank" href={link}>{displayText || link}</Link>
        &nbsp;&nbsp;&nbsp;
        <button
            onClick={() => {
                const data = new ClipboardItem({
                    "text/plain": link
                })
                navigator.clipboard.write([data]);
                alert("Link copied!")
            }}
        >Copy link
        </button>
    </span>
}
import "../styles/card.css";
import React, { ReactNode } from "react";
import Link from "next/link";

type CardProps = {
    header: string,
    children: ReactNode,
    actionLink?: {
        link?: string,
        text: string
    }
    actionElement?: ReactNode
}

export function Card(props: CardProps) {
    return (
        <div className="card">
            <h4>{props.header}</h4>
            {props.children}
            {(props.actionLink && !props.actionElement) && <Link 
                className="action-link" 
                href={props.actionLink.link || "#"}
            >{props.actionLink.text}</Link>}
            {props.actionElement || <></>}
        </div>
    )
} 
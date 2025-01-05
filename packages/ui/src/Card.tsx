"use client";
import "../styles/card.css";
import React, { MouseEventHandler, ReactNode } from "react";

type CardProps = {
    header: string,
    children: ReactNode,
    actionLink?: {
        link?: string,
        onClick?: MouseEventHandler<HTMLAnchorElement>,
        text: string
    }
}

export function Card(props: CardProps) {
    return (
        <div className="card">
            <h4>{props.header}</h4>
            {props.children}
            {props.actionLink && <a 
                className="action-link" 
                href={props.actionLink.link || "#"}
                onClick={e => {
                    if (props.actionLink?.onClick) {
                        e.preventDefault();
                        props.actionLink.onClick(e)
                    }
                    return;
            }}>{props.actionLink.text}</a>}
        </div>
    )
} 
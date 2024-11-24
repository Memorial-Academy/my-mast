import React from "react";
import "@/styles/table.css";

type TableProps = {
    columns: Array<string>,
    children: React.ReactNode
}

export default function Table(props: TableProps) {
    return (
        <table>
            <thead>
                <tr>
                    {props.columns.map(col => {
                        return <th key={col}>{col}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {props.children}
            </tbody>
        </table>
    )
}
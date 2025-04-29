import React from "react";
import "../styles/table.css";

type TableProps = {
    columns: Array<string>,
    children: React.ReactNode
}

type RowProps = {
    data: Array<React.ReactNode | string>
}

export const Table = {
    Root: (props: TableProps) => {
        return (
            <div className="table-wrapper">
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
            </div>
        )
    },
    Row: (props: RowProps) => {
        return (
            <tr>
                {props.data.map(data => {
                    return <td key={data!.toString()}>{data}</td>
                })}
            </tr>
        )
    }
}
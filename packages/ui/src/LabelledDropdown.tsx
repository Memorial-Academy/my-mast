import React, { ChangeEventHandler } from "react";

type LabelledDropdownProps = {
    question: string,
    values: Array<Array<string | number>>,   // 0: value, 1: text
    required?: boolean,
    onChange?: ChangeEventHandler<HTMLSelectElement>,
    name: string
}

export function LabelledDropdown(props: LabelledDropdownProps) {
    return (
        <div className="labelled-input-wrapper">
            <label 
                htmlFor={"dropdown_" + props.name}
                className={"labelled-input " + (props.required ? "required" : "")}
            >{props.question}:</label>
            <select 
                id={"dropdown_" + props.name}
                required={props.required}
                title={props.question}
                name={props.name}
                onChange={props.onChange}
            >
                {props.values.map(opt => {
                    return <option value={opt[0]}>{opt[1]}</option>
                })}
            </select>
        </div>
    )
}
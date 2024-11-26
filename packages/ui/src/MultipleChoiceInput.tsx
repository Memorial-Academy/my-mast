import React from "react";

type SelectableInputProps = {
    name: string,
    values: Array<string>,
    type: "radio" | "checkbox",
    required?: boolean
}

export function MultipleChoice(props: SelectableInputProps) {
    return props.values.map(value => {
        const htmlValue = value.toLowerCase();
        let id = `input_${props.name}_${htmlValue}`;
        
        return (
            <>
                <input 
                    type={props.type}
                    value={htmlValue}
                    required={props.required ? true : false}
                    name={props.name}
                    id={id}
                    key={id}
                />
                <label htmlFor={id}>{value}</label>
                <br/>
            </>
        )
    })
}
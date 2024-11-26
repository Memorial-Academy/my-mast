import React from "react";

type SelectableInputProps = {
    name: string,
    values: Array<string>,
    type: "radio" | "checkbox",
    required?: boolean,
    question: string
}

export function MultipleChoice(props: SelectableInputProps) {
    return (
        <div className="labelled-input-wrapper">
            <p>{props.question}</p>
            {props.values.map(value => {
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
                        <label key={id + "_label"} htmlFor={id}>{value}</label>
                        <br key={id + "_br"} />
                    </>
                )
            })}
        </div>
    )
}
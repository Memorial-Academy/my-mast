"use client";
import React, { ChangeEvent, useState, Fragment } from "react";

type SelectableInputProps = {
    name: string,
    values: Array<[string, string, boolean?]>,
    type: "radio" | "checkbox",
    required?: boolean,
    question: string,
    onChange?: (event: ChangeEvent<HTMLInputElement>, selectedData: Array<string>) => void
}

export function MultipleChoice(props: SelectableInputProps) {
    const [data, setData] = useState<Array<string>>([]);
    return (
        <div className="labelled-input-wrapper">
            <p>{props.question}</p>
            {props.values.map(value => {
                let id = `input_${props.name}_${value[0]}`;
                    
                return (
                    <Fragment key={id}>
                        <input 
                            type={props.type}
                            value={value[0]}
                            required={props.required && props.type == "radio" ? true : false}
                            name={props.name}
                            id={id}
                            onChange={(e) => {
                                let temp = data;
                                
                                if (props.type == "radio") {
                                    // process data if type is radio
                                    temp = [value[0]];
                                } else if (props.type == "checkbox") {
                                    // process data if type is checkbox
                                    if (e.target.checked) { // add the data if the checkbox is newly checked
                                        temp.push(value[0])
                                    } else {                // otherwise remove it
                                        temp.splice(temp.indexOf(value[0]), 1)
                                    }
                                }

                                setData(temp);
                                if (props.onChange) {
                                    props.onChange(e, temp);
                                }
                            }}
                            disabled={value[2]}
                        />
                        <label htmlFor={id}>{value[1]}</label>
                        <br />
                    </Fragment>
                )
            })}
        </div>
    )
}
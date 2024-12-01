"use client";
import React, { ChangeEvent, useState } from "react";

type SelectableInputProps = {
    name: string,
    values: Array<Array<string>>,
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
                const htmlValue = value[0];
                let id = `input_${props.name}_${value[0]}`;
                    
                return (
                    <>
                        <input 
                            type={props.type}
                            value={value[0]}
                            required={props.required ? true : false}
                            name={props.name}
                            id={id}
                            key={id}
                            onChange={(e) => {
                                let temp = data;
                                if(e.target.checked) {
                                    temp.push(value[0])
                                } else {
                                    temp.splice(temp.indexOf(value[0]), 1)
                                }
                                setData(temp);

                                if (props.onChange) {
                                    props.onChange(e, temp);
                                }
                            }}
                        />
                        <label key={id + "_label"} htmlFor={id}>{value[1]}</label>
                        <br key={id + "_br"} />
                    </>
                )
            })}
        </div>
    )
}
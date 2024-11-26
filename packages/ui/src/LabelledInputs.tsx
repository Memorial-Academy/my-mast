import PhoneNumberInput from "./PhoneNumberInput";
import ProtectedInput from "./ProtectedInput";
import React from "react";

type TextInputProps = {
    question: string,
    placeholder?: string,
    name: string,
    type?: string,
    required?: boolean
    // protected?: boolean
}

export function LabelledInput(props: TextInputProps) {
    let elem = <></>;

    if (props.type == "protected") {
        elem = (<ProtectedInput
            placeholder={props.placeholder!}
            name={props.name}
            id={"input_" + props.name}
        />)
    } else if (props.type == "phone") {
        elem = (<PhoneNumberInput
            name={props.name}
            id={"input_" + props.name}
            required={props.required ? true : false}
        />)
    } else {
        elem = (<input
            id={"input_" + props.name}
            name={props.name}
            type={props.type ? props.type : "text"}
            placeholder={props.placeholder}
            className="labelled-input"
            required={props.required ? true : false}
        />)
    }
    
    return (
        <div className="labelled-input-wrapper">
            <label 
                htmlFor={"input_" + props.name}
                className={"labelled-input " + (props.required ? "required" : "")}
            >
                {props.question}
            </label>
            <br/>
            {elem}
        </div>
    )
}
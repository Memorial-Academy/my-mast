"use client";
import React, { ChangeEvent } from "react";
import { useState } from "react";

type PhoneNumberInputProps = {
    name: string,
    id: string,
    required?: boolean,
    defaultValue?: string
}

/*function PhoneNumberInput_OLD(props: PhoneNumberInputProps) {
    const matcher = new RegExp(/[0-9]/);
    const [value, setValue] = useState(props.defaultValue || "");
    const [nums, setNums] = useState(props.defaultValue?.replace(/\(|\)|\s|-/g, "").split("") || new Array<string>);

    function update(key: string) {
        var temp = nums;
        if (key == "Backspace") {
            temp.pop();
        } else if (matcher.test(key) && temp.length < 10) {
            temp.push(key);
        }
        setNums(temp);

        setValue(`(${nums[0] || "_"}${nums[1] || "_"}${nums[2] || "_"}) ${nums[3] || "_"}${nums[4] || "_"}${nums[5] || "_"}-${nums[6] || "_"}${nums[7] || "_"}${nums[8] || "_"}${nums[9] || "_"}`)
    }

    return (
        <input 
            type="text"
            name={props.name}
            id={props.id}
            required={props.required}
            className="labelled-input"
            placeholder="Phone number"

            value={value}
            onKeyDown={e => update(e.key)}
            onChange={e => {e.preventDefault()}}
        />
    )
}*/

export default function PhoneNumberInput(props: PhoneNumberInputProps) {
    const matcher = new RegExp(/[0-9]/);
    const specialSymbols = new RegExp(/\(|\)|\s|-/gm);
    const [value, setValue] = useState(props.defaultValue || "");

    function update(e: ChangeEvent<HTMLInputElement>) {
        let values = e.target.value.replace(specialSymbols, "").split("");
        let str = "";
        let cursorPosition = e.target.selectionStart || 1;
        console.log(cursorPosition)

        console.log(values);
        if (values.length > 10) {
            e.preventDefault();
            return;
        }

        for (var i = 0; i < 10; i++) {
            if (!values[i]) break;
            if (!matcher.test(values[i])) {
                console.log("nonmatch")
                e.preventDefault();
                return;
            }

            if (i == 0) {
                str += "(";
            } else if (i == 3) {
                str += ") ";
            } else if (i == 6) {
                str += "-";
            }
            
            str += values[i];
        }

        console.log(str)
        setValue(str);
        e.target.setSelectionRange(cursorPosition, cursorPosition);
    }

    return (
        <input 
            type="text"
            name={props.name}
            id={props.id}
            required={props.required}
            className="labelled-input"
            placeholder="Phone number"

            value={value}
            // onKeyDown={e => update(e.key)}
            onChange={update}
        />
    )
}
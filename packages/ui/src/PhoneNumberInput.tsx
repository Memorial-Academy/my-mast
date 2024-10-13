"use client";
import React from "react";
import { useState, useRef } from "react";

type PhoneNumberInputProps = {
    name: string,
    id: string,
    required?: boolean,
}

export default function PhoneNumberInput(props: PhoneNumberInputProps) {
    const matcher = new RegExp(/[0-9]/);
    const [value, setValue] = useState("");
    const [nums, setNums] = useState(new Array<string>);

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
}
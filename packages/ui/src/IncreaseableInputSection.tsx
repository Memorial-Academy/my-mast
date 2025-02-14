"use client";
import React from "react";
import { useState } from "react";

type IncreaseableInputSectionProps = {
    sectionName: string,
    element: React.ComponentType<{ count: number } & any>
    elementProps?: { [key: string]: any }
    countTracker?: React.Dispatch<React.SetStateAction<number>>
}

export function IncreaseableInputSection(props: IncreaseableInputSectionProps) {
    let sections = [];
    let [sectionCount, setSectionCount] = useState(1);

    for (var i = 1; i <= sectionCount; i++) {
        sections.push(<props.element count={i} key={`increaseableSection_${props.sectionName}_${i}`} {...props.elementProps} />)
    }

    return (
        <>
            {sections}
            <p>
                <a href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        setSectionCount(sectionCount + 1)
                        if (props.countTracker) {
                            props.countTracker(sectionCount + 1);
                        }
                    }
                }>+ Add {props.sectionName}</a>
                &nbsp;&nbsp;
                {sectionCount > 1 ? <a href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        setSectionCount(sectionCount - 1)
                        if (props.countTracker) {
                            props.countTracker(sectionCount - 1);
                        }
                    }
                }>- Remove {props.sectionName}</a> : <></>}
            </p>
        </>
    )
}
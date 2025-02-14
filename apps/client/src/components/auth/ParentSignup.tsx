"use client";
import { LabelledInput } from "@mymast/ui";
import { useState } from "react";

export default function ParentSignupPage() {
    const [studentCount, setStudentCount] = useState(1);

    let inputs = [];
    for (var i = 1; i <= studentCount; i++) {
        inputs.push(<StudentInformation count={i} key={"student" + i} />)
    }

    return (
        <>
            <input readOnly className="signup-role-tracker" value="parent" title="role" name="role" />
        
            <h2>Student Information</h2>
            <p>
                Enter the information for all the students you wish to enroll in MAST programs.
                <br/>
                Note: you will be able to enroll individual students into programs; you can always change these details later!
            </p>
            {inputs}
            <p>
                <a href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        setStudentCount(studentCount + 1)
                    }
                }>+ Add student</a>
                &nbsp;&nbsp;
                {studentCount > 1 ? <a href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        setStudentCount(studentCount - 1)
                    }
                }>- Remove student</a> : <></>}
            </p>
        </>
    )
}

function StudentInformation({count}: {count: number}) {
    const [name, setName] = useState(["", ""])
    const [personalization, setPersonalization] = useState("Student");
    
    return (
        <>
            <p><b>{name[0] ? `Student: ${name[0]} ${name[1]}` : `Student ${count}`}</b></p>
            <LabelledInput
                type="text"
                question="Student First Name"
                placeholder="First Name"
                required
                name={`student${count}_first_name`}
                onChange={(e) => {
                    setName([e.target.value, name[1]]);
                    if (e.target.value != "") {
                        setPersonalization(`${e.target.value}'s`);
                    } else {
                        setPersonalization("Student");
                    } 
                }}
            />
            <LabelledInput
                type="text"
                question={`${personalization} Last Name`}
                placeholder="Last Name"
                required
                name={`student${count}_last_name`}
                onChange={(e) => {
                    setName([name[0], e.target.value]);
                }}
            />
            <LabelledInput
                type="date"
                question={`${personalization} Date of Birth`}
                placeholder="Birthday"
                required
                name={`student${count}_birthday`}
            />
            <LabelledInput
                type="text"
                question={`Allergies, conditions, etc.?`}
                placeholder="Additional Information"
                name={`student${count}_additional_info`}
            />
        </>
    )
}
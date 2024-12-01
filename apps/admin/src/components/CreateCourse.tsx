"use client";
import React, { useState } from "react";
import { LabelledDropdown, LabelledInput, MultipleChoice } from "@mymast/ui";

export default function CreateCourse({schedule}: {schedule: Schedule[][]}) {
    const [courseCount, setCourseCount] = useState(1);

    let elems = [];

    for (var i = 0; i < courseCount; i++) {
        elems.push(
            <CourseCard num={i + 1} key={`course${i + 1}`} scheduleWeeks={schedule} />
        )
    }

    return (
        <>
            <p>Total courses: {courseCount == 1 ? `${courseCount} (Single curriculum)` : courseCount}</p>
            {elems}
            <p>
                <a href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        setCourseCount(courseCount + 1)
                    }
                }>+ Add course</a>
                &nbsp;&nbsp;
                {courseCount > 1 ? <a href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        setCourseCount(courseCount - 1)
                    }
                }>- Remove course</a> : <></>}
            </p>
        </>
    )
}

function CourseCard({num, scheduleWeeks}: {num: number, scheduleWeeks: Schedule[][]}) {
    const [title, setTitle] = useState(""); 
    const [duration, setDuration] = useState(1); 

    // Determine the options available for the course's duration
    let durationOpts = [];
    for (var i = 1; i <= scheduleWeeks.length; i++) {
        durationOpts.push([i, `${i} Week${i > 1 ? "s" : ""}`])
    }

    // Determine options for enrollment available
    let enrollmentAvailable = [];
    for (var i = 1; i < scheduleWeeks.length + 2 - duration; i++) {
        enrollmentAvailable.push([i.toString(), `Week ${i}`]);
    }

    return (
        <>
            <p><b>{title ? `"${title}"` : `Unnamed Course ${num}`}</b></p>
            <LabelledInput 
                question="Course Name"
                required
                type="text"
                placeholder="Name"
                name={`course${num}_name`}
                onChange={(e) => {
                    setTitle(e.target.value);
                }}
            />
            <div className="bi-fold">
                <LabelledDropdown
                    question="Duration"
                    name={`course${num}_duration`}
                    values={durationOpts}
                    required
                    onChange={e => {
                        setDuration(parseInt(e.target.value));
                    }}
                />
                <MultipleChoice
                    question="Enrollment available during..."
                    required
                    name={`course${num}_enrollment_options`}
                    values={enrollmentAvailable}
                    type="checkbox"
                />
            </div>
        </>
    )
}
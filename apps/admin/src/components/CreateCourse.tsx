"use client";
import React, { useState } from "react";
import { IncreaseableInputSection, LabelledDropdown, LabelledInput, MultipleChoice } from "@mymast/ui";

export default function CreateCourse({schedule}: {schedule: Schedule[][]}) {
    const [courseCount, setCourseCount] = useState(1);

    return (
        <>
            <p>Total courses: {courseCount == 1 ? `${courseCount} (Single curriculum)` : courseCount}</p>
            <IncreaseableInputSection
                sectionName="course"
                element={CourseCard}
                elementProps={{
                    scheduleWeeks: schedule
                }}
                countTracker={setCourseCount}
            />
        </>
    )
}

function CourseCard({count, scheduleWeeks}: {count: number, scheduleWeeks: Schedule[][]}) {
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
            <p><b>{title ? `"${title}"` : `Unnamed Course ${count}`}</b></p>
            <LabelledInput 
                question="Course Name"
                required
                type="text"
                placeholder="Name"
                name={`course${count}_name`}
                onChange={(e) => {
                    setTitle(e.target.value);
                }}
            />
            <div className="bi-fold">
                <LabelledDropdown
                    question="Duration"
                    name={`course${count}_duration`}
                    values={durationOpts}
                    required
                    onChange={e => {
                        setDuration(parseInt(e.target.value));
                    }}
                />
                <MultipleChoice
                    question="Enrollment available during..."
                    required
                    name={`course${count}_enrollment_options`}
                    values={enrollmentAvailable}
                    type="checkbox"
                />
            </div>
        </>
    )
}
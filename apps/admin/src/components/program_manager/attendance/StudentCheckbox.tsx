"use client";
import API from "@/app/lib/APIHandler";
import { Session } from "@mymast/api/Types";
import { longDateString } from "@mymast/utils/string_helpers";
import { useRouter } from "next/navigation";
import { useState } from "react";

type StudentAttendanceCheckboxProps = {
    auth: Session,
    program: string,
    student: string,
    day: {
        date: number,
        year: number,
        month: number
    },
    status: boolean
}

export default function StudentAttendanceCheckbox({auth, program, day, student, status}: StudentAttendanceCheckboxProps) {
    const [checkboxStatus, setCheckboxStatus] = useState(status);
    const router = useRouter();
    
    return (
        <input 
            type="checkbox"
            value="present"
            checked={checkboxStatus}
            aria-label={`Student present on ${longDateString(day)}`}
            title={`Student present on ${longDateString(day)}`}
            onChange={(e) => {
                e.preventDefault();
                API.Admin.attendance.toggleStudentAttendance(
                    auth.uuid,
                    auth.token,
                    program,
                    student,
                    day
                ).then(({status: result}) => {
                    setCheckboxStatus(result);
                    router.refresh();
                })
            }}
        />
    )
}